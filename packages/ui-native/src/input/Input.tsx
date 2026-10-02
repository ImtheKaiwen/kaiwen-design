import * as React from "react";
import {
  TextInput as RNTextInput,
  View,
  Pressable,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { radius } from "@kaiwen/tokens";
import { useTheme } from "../theme/useTheme.js";
import { Text } from "../typography/Text.js";

export type NativeInputSize = "sm" | "md" | "lg";

export interface NativeInputProps extends RNTextInputProps {
  size?: NativeInputSize;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  success?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeConfig = {
  sm: { height: 36, fontSize: 13, paddingHorizontal: 10 },
  md: { height: 44, fontSize: 14, paddingHorizontal: 12 },
  lg: { height: 50, fontSize: 16, paddingHorizontal: 16 },
};

export const Input = React.forwardRef<RNTextInput, NativeInputProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error,
      success,
      startIcon,
      endIcon,
      fullWidth = true,
      editable = true,
      style,
      ...props
    },
    ref,
  ) => {
    const { themeObject } = useTheme();
    const currentSize = sizeConfig[size] || sizeConfig.md;
    const isError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    const borderColor = isError
      ? themeObject.colors.status.error
      : success
        ? themeObject.colors.status.success
        : themeObject.colors.border.default;

    const containerStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      borderRadius: parseFloat(radius.md),
      backgroundColor: themeObject.colors.surface.secondary,
      borderWidth: 1,
      borderColor,
      opacity: editable ? 1 : 0.45,
    };

    const inputStyle: TextStyle = {
      flex: 1,
      height: "100%",
      fontSize: currentSize.fontSize,
      color: themeObject.colors.text.primary,
      paddingVertical: 0,
    };

    return (
      <View style={{ width: fullWidth ? "100%" : undefined, gap: 6 }}>
        {label && (
          <Text
            variant="label"
            style={{
              color: isError
                ? themeObject.colors.status.error
                : themeObject.colors.text.secondary,
            }}
          >
            {label}
          </Text>
        )}

        <View style={containerStyle}>
          {startIcon && <View style={{ marginRight: 8 }}>{startIcon}</View>}
          <RNTextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={themeObject.colors.text.muted}
            style={[inputStyle, style]}
            {...props}
          />
          {endIcon && <View style={{ marginLeft: 8 }}>{endIcon}</View>}
        </View>

        {(errorMessage || helperText) && (
          <Text
            variant="caption"
            style={{
              color: isError
                ? themeObject.colors.status.error
                : themeObject.colors.text.muted,
            }}
          >
            {errorMessage || helperText}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

export const EmailInput = React.forwardRef<RNTextInput, NativeInputProps>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        {...props}
      />
    );
  },
);

EmailInput.displayName = "EmailInput";

export const PhoneInput = React.forwardRef<RNTextInput, NativeInputProps>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        {...props}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export const NumberInput = React.forwardRef<RNTextInput, NativeInputProps>(
  (props, ref) => {
    return <Input ref={ref} keyboardType="numeric" {...props} />;
  },
);

NumberInput.displayName = "NumberInput";

export const PasswordInput = React.forwardRef<RNTextInput, NativeInputProps>(
  (props, ref) => {
    const [secure, setSecure] = React.useState(true);

    return (
      <Input
        ref={ref}
        secureTextEntry={secure}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        endIcon={
          <Pressable onPress={() => setSecure((p) => !p)}>
            <Text variant="caption" style={{ color: "#71717A" }}>
              {secure ? "SHOW" : "HIDE"}
            </Text>
          </Pressable>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export interface NativeOTPInputProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  disabled?: boolean;
}

export const OTPInput: React.FC<NativeOTPInputProps> = ({
  length = 6,
  value = "",
  onChange,
  disabled = false,
}) => {
  const { themeObject } = useTheme();
  const inputRef = React.useRef<RNTextInput>(null);

  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const handlePress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <RNTextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const sanitized = text.replace(/\D/g, "").slice(0, length);
          onChange?.(sanitized);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        editable={!disabled}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
          opacity: disabled ? 0.45 : 1,
        }}
      >
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 44,
              height: 52,
              borderWidth: 1,
              borderColor: themeObject.colors.border.default,
              borderRadius: parseFloat(radius.md),
              backgroundColor: themeObject.colors.surface.secondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              variant="h3"
              style={{
                color: themeObject.colors.text.primary,
                fontWeight: "600",
              }}
            >
              {digits[i] || ""}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

OTPInput.displayName = "OTPInput";
