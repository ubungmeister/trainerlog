package com.trainerlog.exception;

public class DuplicateSessionException extends RuntimeException {
  public DuplicateSessionException(String message) {
    super(message);
  }
}