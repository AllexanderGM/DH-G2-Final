package com.tours.tours.exception;

public class NoAutorizado extends RuntimeException {
    public NoAutorizado(String message) {
        super(message);
    }
}