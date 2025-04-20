package com.recipidia.ingredient.enums;

public enum StorageType {
  FRIDGE("fridge"),
  FREEZER("freezer"),
  ALL("all");

  private final String value;

  StorageType(String value) {
    this.value = value;
  }

  public static StorageType from(String value) {
    for (StorageType type : values()) {
      if (type.value.equalsIgnoreCase(value)) return type;
    }
    throw new IllegalArgumentException("Unknown storage type: " + value);
  }

  public String getValue() {
    return value;
  }
}
