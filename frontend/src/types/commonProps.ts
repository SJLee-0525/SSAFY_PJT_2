import React from "react";

export interface ButtonProps {
  type: "button" | "submit" | "reset";
  design: "confirm" | "cancel";
  content: string;
  onAction?: () => void;
  className?: string;
}

export interface FilterButtonProps {
  isSelected?: boolean;
  content: string;
  count?: number;
  className?: string;
  onAction?: () => void;
}

export interface InputProps {
  label?: string;
  name?: string;
  type: string;
  placeHolder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelTextSize?: string;
}

export interface DateInputProps {
  label?: string;
  name: string;
  type: string;
  value?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ToggleProps {
  isToggle: boolean;
  onToggle: (isToggle: boolean) => void;
}

export interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export interface KeypadElemProps {
  value: string;
  onChange: (val: string) => void;
}
