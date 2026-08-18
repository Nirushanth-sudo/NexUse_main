-- database/schema.sql
-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS nexuse_db;
USE nexuse_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT NULL,
    reviews_count INT DEFAULT 0 NOT NULL,
    verified TINYINT(1) DEFAULT 0 NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    location VARCHAR(100) NOT NULL,
    address TEXT DEFAULT NULL,
    joined_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'SUSPENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CATEGORY TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. LISTING TABLE (Marketplace Listings)
CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    item_condition VARCHAR(50) NOT NULL, -- 'Like New', 'Good', 'Fair'
    type VARCHAR(20) NOT NULL, -- 'buy', 'rent', 'share'
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    location VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    owner_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'SOLD', 'ARCHIVED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_listing_type CHECK (type IN ('buy', 'rent', 'share')),
    CONSTRAINT chk_listing_status CHECK (status IN ('PENDING', 'APPROVED', 'SOLD', 'ARCHIVED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. DONATION_REQUEST TABLE (Requests made by community members)
CREATE TABLE IF NOT EXISTS donation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    proof_file VARCHAR(255) DEFAULT NULL,
    requester_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    urgent TINYINT(1) DEFAULT 0 NOT NULL,
    target_qty INT NOT NULL,
    pledged_qty INT DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'FULFILLED', 'CLOSED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_donation_req_status CHECK (status IN ('OPEN', 'FULFILLED', 'CLOSED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PLEDGE TABLE (Pledges made by donors to fulfill donation requests)
CREATE TABLE IF NOT EXISTS pledges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    donor_id INT NOT NULL,
    pledge_note TEXT NOT NULL,
    proof_file VARCHAR(255) DEFAULT NULL,
    pledged_qty INT DEFAULT 1 NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'VERIFIED', 'COMPLETED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (request_id) REFERENCES donation_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_pledge_status CHECK (status IN ('PENDING', 'VERIFIED', 'COMPLETED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. REVIEW TABLE (Peer reviews between users after transaction)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating DECIMAL(2, 1) NOT NULL,
    review_text TEXT NOT NULL,
    created_at DATE NOT NULL,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_review_self CHECK (reviewer_id <> reviewee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. DISPUTE TABLE (Complaints raised for admin review)
CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(150) NOT NULL,
    details TEXT NOT NULL,
    reporter_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'RESOLVED', 'DISMISSED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_dispute_status CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. NOTIFICATION TABLE (User notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'SUCCESS', 'INFO', 'WARNING', 'ERROR'
    is_read TINYINT(1) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_notif_type CHECK (type IN ('SUCCESS', 'INFO', 'WARNING', 'ERROR'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. WISHLIST TABLE (Junction table mapping users to saved listings)
CREATE TABLE IF NOT EXISTS wishlist (
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    PRIMARY KEY (user_id, listing_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. CART TABLE (Junction table mapping users to added cart items)
CREATE TABLE IF NOT EXISTS cart (
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    PRIMARY KEY (user_id, listing_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
