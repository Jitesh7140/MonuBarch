/*
# Create Order Number Generator Function

## Overview
Creates a database function that generates sequential order numbers in the format POR-YYYY-####.
Uses a sequence to ensure uniqueness even across concurrent requests.

## New Functions
- `generate_order_number()` - Returns a unique order number like 'POR-2026-0001'

## Notes
1. The sequence is created once and persists across requests.
2. The year portion is extracted from the current date.
3. The sequence number is zero-padded to 4 digits.
*/

-- Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1 INCREMENT 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  seq_val bigint;
  year_text text;
  order_num text;
BEGIN
  seq_val := nextval('order_number_seq');
  year_text := EXTRACT(YEAR FROM now())::text;
  order_num := 'POR-' || year_text || '-' || lpad(seq_val::text, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;