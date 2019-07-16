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
    number_plate VARCHAR NOT NULL UNIQUE,
    manufacturer VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year VARCHAR NOT NULL,
    capacity INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TYPE trip_status as ENUM ('active', 'cancelled');
CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES bus(id),
    origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    trip_date DATE NOT NULL CHECK (trip_date >= NOW()),
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

INSERT INTO "user" (email, first_name, last_name, password, is_admin)
VALUES ('wahaaabello@gmail.com', 'Wahab', 'Bello', '$2b$10$BQrt/v8O73f1qn6RycQRRe6ijNILiUdddPXYFoPPjhqcqtJNX/0Ha', TRUE);

INSERT INTO "bus" (number_plate, manufacturer, model, year, capacity)
VALUES ('BA.987PA', 'Toyota', 'HiAce', '2016', 12),
('AF.434ER', 'Toyota', 'Hummer', '2014', 12),
('EF.952HW', 'Toyota', 'HiAce', '2012', 16),
('QG.582HQ', 'Toyota', 'Hummer', '2010', 16);

INSERT INTO "trip" (bus_id, origin, destination, trip_date, fare)
VALUES (1, 'Lagos', 'Ibadan', '2019-12-21T00:00:00.000Z', 1200.00),
       (2, 'Port Harcourt', 'Jos', '2019-12-28T00:00:00.000Z', 1600.00),
       (3, 'Abuja', 'Lafia', '2019-12-14T00:00:00.000Z', 2400.00);
