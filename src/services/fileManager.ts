import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export interface ManagedFile {
  id: string;
  originalUri: string;
  localPath: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  isTemporary: boolean;
}

export interface FileInfo {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

class FileManager {
  private readonly documentsDir: string;
  private readonly tempDir: string;
  private readonly cacheDir: string;

  constructor() {
    // Set up directory paths based on platform
    if (Platform.OS === 'ios') {
      this.documentsDir = RNFS.DocumentDirectoryPath + '/DMSDocuments';
      this.tempDir = RNFS.TemporaryDirectoryPath + '/DMSTemp';
      this.cacheDir = RNFS.CachesDirectoryPath + '/DMSCache';
    } else {
      this.documentsDir = RNFS.ExternalDirectoryPath + '/DMSDocuments';
      this.tempDir = RNFS.ExternalDirectoryPath + '/DMSTemp';
      this.cacheDir = RNFS.ExternalDirectoryPath + '/DMSCache';
    }
  }

  /**
   * Initialize file manager by creating necessary directories
   */
  async initialize(): Promise<void> {
    try {
      const directories = [this.documentsDir, this.tempDir, this.cacheDir];

      for (const dir of directories) {
        const exists = await RNFS.exists(dir);
        if (!exists) {
          await RNFS.mkdir(dir);
          console.log(`Created directory: ${dir}`);
        }
      }
    } catch (error) {
      console.error('Failed to initialize file manager:', error);
      throw new Error('File manager initialization failed');
    }
  }

  /**
   * Save a file to permanent storage
   */
  async saveFile(
    fileInfo: FileInfo,
    category: 'documents' | 'images' = 'documents',
  ): Promise<ManagedFile> {
    try {
      await this.initialize();

      const fileId = this.generateFileId();
      const fileName = this.sanitizeFileName(fileInfo.name);
      const categoryDir = `${this.documentsDir}/${category}`;

      // Create category directory if it doesn't exist
      const categoryExists = await RNFS.exists(categoryDir);
      if (!categoryExists) {
        await RNFS.mkdir(categoryDir);
      }

      const localPath = `${categoryDir}/${fileId}_${fileName}`;

      // Copy file from original location to our managed location
      await RNFS.copyFile(fileInfo.uri, localPath);

      // Get file stats
      const stats = await RNFS.stat(localPath);

      const managedFile: ManagedFile = {
        id: fileId,
        originalUri: fileInfo.uri,
        localPath,
        name: fileName,
        type: fileInfo.type || this.getMimeTypeFromExtension(fileName),
        size: fileInfo.size || stats.size,
        createdAt: new Date().toISOString(),
        isTemporary: false,
      };

      console.log(`File saved: ${fileName} -> ${localPath}`);
      return managedFile;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw new Error(`Failed to save file: ${fileInfo.name}`);
    }
  }

  /**
   * Save a file to temporary storage (for processing or preview)
   */
  async saveTemporaryFile(fileInfo: FileInfo): Promise<ManagedFile> {
    try {
      await this.initialize();

      const fileId = this.generateFileId();
      const fileName = this.sanitizeFileName(fileInfo.name);
      const localPath = `${this.tempDir}/${fileId}_${fileName}`;

      await RNFS.copyFile(fileInfo.uri, localPath);
      const stats = await RNFS.stat(localPath);

      const managedFile: ManagedFile = {
        id: fileId,
        originalUri: fileInfo.uri,
        localPath,
        name: fileName,
        type: fileInfo.type || this.getMimeTypeFromExtension(fileName),
        size: fileInfo.size || stats.size,
        createdAt: new Date().toISOString(),
        isTemporary: true,
      };

      console.log(`Temporary file saved: ${fileName} -> ${localPath}`);
      return managedFile;
    } catch (error) {
      console.error('Failed to save temporary file:', error);
      throw new Error(`Failed to save temporary file: ${fileInfo.name}`);
    }
  }

  /**
   * Delete a managed file
   */
  async deleteFile(fileId: string, filePath?: string): Promise<boolean> {
    try {
      const pathToDelete = filePath || (await this.findFileById(fileId));

      if (pathToDelete) {
        const exists = await RNFS.exists(pathToDelete);
        if (exists) {
          await RNFS.unlink(pathToDelete);
          console.log(`File deleted: ${pathToDelete}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      return await RNFS.exists(filePath);
    } catch (error) {
      console.error('Failed to check file existence:', error);
      return false;
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(filePath: string): Promise<RNFS.StatResult | null> {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        return await RNFS.stat(filePath);
      }
      return null;
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  /**
   * List all files in a directory
   */
  async listFiles(
    directory: 'documents' | 'temp' | 'cache' = 'documents',
  ): Promise<string[]> {
    try {
      let dirPath: string;

      switch (directory) {
        case 'documents':
          dirPath = this.documentsDir;
          break;
        case 'temp':
          dirPath = this.tempDir;
          break;
        case 'cache':
          dirPath = this.cacheDir;
          break;
        default:
          dirPath = this.documentsDir;
      }

      const exists = await RNFS.exists(dirPath);
      if (!exists) {
        return [];
      }

      return await RNFS.readDir(dirPath).then(result =>
        result.filter(item => item.isFile()).map(item => item.path),
      );
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  /**
   * Clean up temporary files older than specified hours
   */
  async cleanTemporaryFiles(olderThanHours: number = 24): Promise<number> {
    try {
      const files = await RNFS.readDir(this.tempDir);
      const cutoffTime = Date.now() - olderThanHours * 60 * 60 * 1000;
      let deletedCount = 0;

      for (const file of files) {
        if (file.isFile()) {
          const stats = await RNFS.stat(file.path);
          const fileTime = new Date(stats.mtime).getTime();

          if (fileTime < cutoffTime) {
            await RNFS.unlink(file.path);
            deletedCount++;
          }
        }
      }

      console.log(`Cleaned ${deletedCount} temporary files`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to clean temporary files:', error);
      return 0;
    }
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{
    documentsSize: number;
    tempSize: number;
    cacheSize: number;
    totalSize: number;
  }> {
    try {
      const [documentsSize, tempSize, cacheSize] = await Promise.all([
        this.getDirectorySize(this.documentsDir),
        this.getDirectorySize(this.tempDir),
        this.getDirectorySize(this.cacheDir),
      ]);

      return {
        documentsSize,
        tempSize,
        cacheSize,
        totalSize: documentsSize + tempSize + cacheSize,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        documentsSize: 0,
        tempSize: 0,
        cacheSize: 0,
        totalSize: 0,
      };
    }
  }

  /**
   * Move file from temporary to permanent storage
   */
  async promoteTemporaryFile(
    tempFilePath: string,
    category: 'documents' | 'images' = 'documents',
  ): Promise<string> {
    try {
      const fileName = tempFilePath.split('/').pop() || 'unknown';
      const categoryDir = `${this.documentsDir}/${category}`;

      const categoryExists = await RNFS.exists(categoryDir);
      if (!categoryExists) {
        await RNFS.mkdir(categoryDir);
      }

      const newPath = `${categoryDir}/${fileName}`;
      await RNFS.moveFile(tempFilePath, newPath);

      console.log(`File promoted: ${tempFilePath} -> ${newPath}`);
      return newPath;
    } catch (error) {
      console.error('Failed to promote temporary file:', error);
      throw new Error('Failed to promote temporary file');
    }
  }

  // Private helper methods
  private generateFileId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeFileName(fileName: string): string {
    // Remove or replace invalid characters
    return fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  }

  private getMimeTypeFromExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      txt: 'text/plain',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  private async findFileById(fileId: string): Promise<string | null> {
    try {
      const directories = [this.documentsDir, this.tempDir, this.cacheDir];

      for (const dir of directories) {
        const files = await RNFS.readDir(dir);
        const found = files.find(file => file.name.startsWith(fileId));
        if (found) {
          return found.path;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to find file by ID:', error);
      return null;
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const exists = await RNFS.exists(dirPath);
      if (!exists) {
        return 0;
      }

      const files = await RNFS.readDir(dirPath);
      let totalSize = 0;

      for (const file of files) {
        if (file.isFile()) {
          const stats = await RNFS.stat(file.path);
          totalSize += stats.size;
        } else if (file.isDirectory()) {
          totalSize += await this.getDirectorySize(file.path);
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate directory size:', error);
      return 0;
    }
  }
}

// Singleton instance
export const fileManager = new FileManager();
export default fileManager;
