CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    trainer_id UUID,
    FOREIGN KEY (trainer_id) REFERENCES users(id)
); 