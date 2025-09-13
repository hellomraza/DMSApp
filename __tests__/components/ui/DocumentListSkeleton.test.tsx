import React from "react";
import { render } from "@testing-library/react-native";
import DocumentListSkeleton from "../../../src/components/ui/DocumentListSkeleton";

jest.mock("../../../src/utils/scale", () => ({
  scale: (value: number) => value,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
}));

describe("DocumentListSkeleton", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<DocumentListSkeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it("should render without crashing", () => {
    expect(() => render(<DocumentListSkeleton />)).not.toThrow();
  });

  it("should handle mount and unmount", () => {
    const { unmount } = render(<DocumentListSkeleton />);
    expect(() => unmount()).not.toThrow();
  });
});
