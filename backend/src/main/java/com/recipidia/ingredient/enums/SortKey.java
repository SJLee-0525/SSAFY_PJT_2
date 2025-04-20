package com.recipidia.ingredient.enums;

public enum SortKey {
  EXPIRE("expire"),
  NAME("name");

  private final String value;

  SortKey(String value) {
    this.value = value;
  }

  public static SortKey from(String value) {
    for (SortKey key : values()) {
      if (key.value.equalsIgnoreCase(value)) return key;
    }
    throw new IllegalArgumentException("Unknown sort key: " + value);
  }
}
