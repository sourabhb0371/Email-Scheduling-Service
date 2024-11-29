-- Create the database
CREATE DATABASE IF NOT EXISTS XmenEmailGen;

-- Use the created database
USE XmenEmailGen;

-- Create the clients table with string IDs (VARCHAR)
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(255) PRIMARY KEY,              -- Unique ID for each client (string format)
    email VARCHAR(255) NOT NULL,              -- Client's email address
    password VARCHAR(255) NOT NULL,           -- Client's password
    username VARCHAR(255) NOT NULL,           -- Client's username
    UNIQUE (email),                          -- Ensure email is unique
    UNIQUE (username)                        -- Ensure username is unique
);

-- Create the template table with string IDs (VARCHAR) for both template ID and clientId
CREATE TABLE IF NOT EXISTS template (
    id VARCHAR(255) PRIMARY KEY,              -- Unique ID for each template (string format)
    clientId VARCHAR(255) NOT NULL,           -- Client ID that references the clients table (string format)
    templateBody TEXT NOT NULL,              -- Body of the email template (could be HTML, plain text, etc.)
    templateName VARCHAR(255) NOT NULL,       -- Name of the template
    templateSubject VARCHAR(255) NOT NULL,    -- Subject of the template
    FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE  -- Foreign key constraint with CASCADE delete
);
