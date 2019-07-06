DROP TABLE booking;
DROP TABLE trip;
DROP TABLE bus;
DROP TABLE "user";
DROP TYPE trip_status;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bus (
    id SERIAL PRIMARY KEY,
    number_plate VARCHAR NOT NULL,
    manufacturer VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year VARCHAR NOT NULL,
    ​capacity  INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TYPE trip_status as ENUM ('active', 'cancelled');
CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES bus(id),
    origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    trip_date DATE NOT NULL,
    fare FLOAT(2) NOT NULL,
    status trip_status DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trip(id),
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    created_on DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO "user" (first_name, last_name, email, password, is_admin) VALUES ('John', 'Doe', 'foo@bar.co', 'password', TRUE);
INSERT INTO bus (number_plate, manufacturer, model, year) VALUES ('JAFKDFE', 'Honda', 'X65', '2017');
INSERT INTO trip (bus_id, origin, destination, trip_date, fare) VALUES (1, 'Lagos', 'Abuja', '2017-08-28', 2500);
INSERT INTO booking (trip_id, user_id) VALUES (1, 1);

SELECT * FROM "user";
SELECT * FROM "bus";
SELECT * FROM "trip";
SELECT * FROM "booking";
