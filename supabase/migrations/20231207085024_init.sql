CREATE TABLE customers (
    id uuid not null references auth.users on delete cascade,
    email VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    stripe_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    primary key (id)
);

alter table customers enable row level security;

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT 'Untitled',
    allowed_origins TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    allowed_targets TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    owner_id INT NOT NULL,
    archived_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    signature_live VARCHAR(255) UNIQUE NOT NULL,
    signature_test VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES customers(id)
);

alter table applications enable row level security;

CREATE TABLE applications_onboarding (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    allowed_origins TEXT[] DEFAULT ARRAY[]::TEXT[],
    price_id VARCHAR(255),
    key VARCHAR(255) UNIQUE,
    email_sent_at TIMESTAMP[] DEFAULT ARRAY[]::TIMESTAMP[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
