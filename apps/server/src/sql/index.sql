
CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES exp_users(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    value NUMERIC(10, 2) NOT NULL,  -- Directly create the column with NUMERIC type
    description TEXT DEFAULT 'No description'  -- Add the column during table creation
);


CREATE TABLE exp_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON exp_users(username);
CREATE INDEX idx_email ON exp_users(email);

