"""
UZCERT & OWASP Top 10 A04:2025 / A08:2025 - File Upload Security Validators.
Validates file sizes, magic bytes, and blocks embedded executable code / webshells.
"""
from django.core.exceptions import ValidationError

MAX_UPLOAD_SIZE = 25 * 1024 * 1024  # 25 MB

DANGEROUS_PAYLOADS = [
    b'<?php',
    b'<%',
    b'<script',
    b'#!/bin/sh',
    b'#!/bin/bash',
    b'#!/usr/bin/env',
    b'eval(',
    b'base64_decode(',
    b'passthru(',
    b'shell_exec(',
]

def validate_safe_upload(file):
    """
    Validates uploaded file against:
    1. Maximum file size (25MB)
    2. Known safe magic byte signatures (PDF, PNG, JPG, WEBP, ZIP, DOCX, RAR, HEIC)
    3. Executable / script injection signatures (PHP, Shell, ASP, JS)
    """
    if not file:
        return

    # 1. Size check
    size = getattr(file, 'size', None)
    if size is not None and size > MAX_UPLOAD_SIZE:
        raise ValidationError(f"Fayl hajmi ruxsat etilgan 25MB chegarasidan oshmasligi kerak. Joriy hajm: {size // (1024 * 1024)}MB")

    # 2. Read initial bytes safely
    try:
        initial_pos = file.tell()
    except Exception:
        initial_pos = 0

    try:
        file.seek(0)
        header = file.read(64)
        sample = file.read(2048)
        content_sample = (header + sample).lower()

        # Check for dangerous webshell / executable strings
        for bad in DANGEROUS_PAYLOADS:
            if bad in content_sample:
                raise ValidationError("Xavfli yoki ruxsat etilmagan fayl tarkibi aniqlandi.")

        # Check magic bytes
        is_pdf = header.startswith(b'%PDF-')
        is_png = header.startswith(b'\x89PNG\r\n\x1a\n')
        is_jpg = header.startswith(b'\xff\xd8\xff')
        is_webp = header.startswith(b'RIFF') and header[8:12] == b'WEBP'
        is_zip_docx = header.startswith(b'PK\x03\x04') or header.startswith(b'PK\x05\x06')
        is_rar = header.startswith(b'Rar!\x1a\x07') or header.startswith(b'\x52\x61\x72\x21')
        is_heic = b'ftyp' in header[:16]

        if not (is_pdf or is_png or is_jpg or is_webp or is_zip_docx or is_rar or is_heic):
            # If unknown binary format
            raise ValidationError("Fayl formati (magic bytes) haqiqiy emas yoki qo'llab-quvvatlanmaydi.")

    finally:
        try:
            file.seek(initial_pos)
        except Exception:
            pass
