# useTimer Hook

A custom React hook for managing countdown timers with full control over timer state and actions.

## Features

- ✅ **Countdown Timer**: Automatically decrements from initial time
- ✅ **Auto-start**: Optionally start timer immediately
- ✅ **State Management**: Track running, completed states
- ✅ **Control Actions**: Start, stop, reset, restart
- ✅ **Time Formatting**: Built-in MM:SS formatting
- ✅ **Completion Callback**: Execute action when timer completes
- ✅ **Memory Safe**: Automatic cleanup on unmount

## Import

```typescript
import { useTimer } from '../hooks/useTimer';
// or
import { useTimer } from '../hooks';
```

## Basic Usage

```typescript
const MyComponent = () => {
  const { time, isCompleted, formatTime } = useTimer({
    initialTime: 60, // 60 seconds
    autoStart: true,
  });

  return (
    <div>
      <p>Time remaining: {formatTime()}</p>
      {isCompleted && <p>Time's up!</p>}
    </div>
  );
};
```

## API Reference

### Parameters

```typescript
interface UseTimerProps {
  initialTime: number; // Initial countdown time in seconds
  onComplete?: () => void; // Callback when timer reaches 0
  autoStart?: boolean; // Start timer immediately (default: true)
}
```

### Return Values

```typescript
interface UseTimerReturn {
  time: number; // Current time in seconds
  isRunning: boolean; // Whether timer is currently running
  isCompleted: boolean; // Whether timer has reached 0
  start: () => void; // Start the timer
  stop: () => void; // Stop the timer
  reset: (newTime?: number) => void; // Reset to initial or new time
  restart: (newTime?: number) => void; // Reset and start immediately
  formatTime: (seconds?: number) => string; // Format time as MM:SS
}
```

## Advanced Usage Examples

### OTP Verification Timer

```typescript
const OTPScreen = () => {
  const {
    time: timer,
    isCompleted: canResend,
    restart: restartTimer,
    formatTime,
  } = useTimer({
    initialTime: 60,
    autoStart: true,
    onComplete: () => {
      console.log('You can now resend OTP');
    },
  });

  const handleResendOTP = () => {
    // API call to resend OTP
    sendOTP().then(() => {
      restartTimer(60); // Restart with 60 seconds
    });
  };

  return (
    <View>
      {!canResend ? (
        <Text>Resend OTP in {formatTime()}</Text>
      ) : (
        <TouchableOpacity onPress={handleResendOTP}>
          <Text>Resend OTP</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### Manual Timer Control

```typescript
const ManualTimer = () => {
  const { time, isRunning, isCompleted, start, stop, reset, formatTime } =
    useTimer({
      initialTime: 300, // 5 minutes
      autoStart: false, // Don't start automatically
    });

  return (
    <View>
      <Text style={styles.timer}>{formatTime()}</Text>

      <View style={styles.controls}>
        {!isRunning ? (
          <Button title="Start" onPress={start} />
        ) : (
          <Button title="Pause" onPress={stop} />
        )}

        <Button title="Reset" onPress={() => reset()} />
        <Button title="Reset to 2 min" onPress={() => reset(120)} />
      </View>

      {isCompleted && <Text style={styles.completed}>Timer completed!</Text>}
    </View>
  );
};
```

### Session Timer with Warnings

```typescript
const SessionTimer = () => {
  const [showWarning, setShowWarning] = useState(false);

  const { time, formatTime, restart } = useTimer({
    initialTime: 1800, // 30 minutes
    autoStart: true,
    onComplete: () => {
      Alert.alert('Session Expired', 'Please log in again');
      // Logout logic
    },
  });

  // Show warning when 5 minutes left
  useEffect(() => {
    if (time === 300 && !showWarning) {
      setShowWarning(true);
      Alert.alert('Warning', 'Session expires in 5 minutes');
    }
  }, [time, showWarning]);

  const extendSession = () => {
    restart(1800); // Restart with 30 minutes
    setShowWarning(false);
  };

  return (
    <View>
      <Text>Session expires in: {formatTime()}</Text>

      {time <= 300 && (
        <TouchableOpacity onPress={extendSession}>
          <Text>Extend Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### Multiple Timers

```typescript
const MultipleTimers = () => {
  const workTimer = useTimer({
    initialTime: 1500, // 25 minutes work
    autoStart: false,
  });

  const breakTimer = useTimer({
    initialTime: 300, // 5 minutes break
    autoStart: false,
  });

  const startWork = () => {
    breakTimer.stop();
    workTimer.restart(1500);
  };

  const startBreak = () => {
    workTimer.stop();
    breakTimer.restart(300);
  };

  return (
    <View>
      <View>
        <Text>Work: {workTimer.formatTime()}</Text>
        <Text>Running: {workTimer.isRunning ? 'Yes' : 'No'}</Text>
      </View>

      <View>
        <Text>Break: {breakTimer.formatTime()}</Text>
        <Text>Running: {breakTimer.isRunning ? 'Yes' : 'No'}</Text>
      </View>

      <View>
        <Button title="Start Work" onPress={startWork} />
        <Button title="Start Break" onPress={startBreak} />
      </View>
    </View>
  );
};
```

## Method Details

### `formatTime(seconds?: number)`

Formats time in MM:SS format. If no parameter provided, uses current timer value.

```typescript
formatTime(); // Current timer time
formatTime(65); // "01:05"
formatTime(3661); // "61:01"
```

### `reset(newTime?: number)`

Stops timer and resets to initial time or provided time.

```typescript
reset(); // Reset to initialTime
reset(120); // Reset to 2 minutes
```

### `restart(newTime?: number)`

Resets timer and immediately starts counting down.

```typescript
restart(); // Restart with initialTime
restart(30); // Restart with 30 seconds
```

## Best Practices

### 1. **Use Completion Callbacks**

```typescript
const timer = useTimer({
  initialTime: 60,
  onComplete: () => {
    // Always handle completion
    setCanProceed(true);
  },
});
```

### 2. **Handle Component Unmounting**

The hook automatically cleans up on unmount, but ensure completion callbacks don't cause state updates:

```typescript
const timer = useTimer({
  initialTime: 60,
  onComplete: () => {
    // Safe - hook handles cleanup
    analytics.track('timer_completed');
  },
});
```

### 3. **Use Descriptive Variable Names**

```typescript
// ✅ Good
const { time: otpTimer, isCompleted: canResendOTP } = useTimer({...});

// ❌ Avoid
const { time: t, isCompleted: done } = useTimer({...});
```

### 4. **Conditional Rendering**

```typescript
return (
  <View>
    {timer.isCompleted ? (
      <Button title="Resend" onPress={handleResend} />
    ) : (
      <Text>Wait {timer.formatTime()}</Text>
    )}
  </View>
);
```

## Performance Notes

- Timer uses `setInterval` efficiently with automatic cleanup
- State updates only occur when timer value changes
- No unnecessary re-renders when timer is not running
- Memory leaks prevented with proper cleanup on unmount

## TypeScript Support

Full TypeScript support with proper type definitions for all parameters and return values.

## Common Use Cases

- ✅ OTP verification timers
- ✅ Session timeout warnings
- ✅ Pomodoro timers
- ✅ Game timers
- ✅ Form submission delays
- ✅ Rate limiting displays
- ✅ Auto-logout timers
