-- ========================
-- DROP EXISTING TABLES (if needed)
-- ========================
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ========================
-- TABLES
-- ========================

-- Profiles table (depends on auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'admin')),
    name text,
    email text,
    preferences jsonb DEFAULT '{}'::jsonb,
    interests text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Destinations table (independent)
CREATE TABLE IF NOT EXISTS destinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    country text NOT NULL,
    description text,
    image_url text,
    rating numeric CHECK (rating >= 0 AND rating <= 5),
    price_range text,
    best_time text,
    highlights text[],
    category text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (name, country)
);

-- Trips table (depends on profiles and destinations)
CREATE TABLE IF NOT EXISTS trips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    destination_id uuid REFERENCES destinations(id) ON DELETE SET NULL,
    start_date date,
    end_date date,
    budget numeric,
    status text CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    preferences jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Bookings table (depends on trips)
CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
    booking_type text CHECK (booking_type IN ('hotel', 'flight', 'activity')),
    details jsonb NOT NULL,
    status text CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Hotels table (independent)
CREATE TABLE IF NOT EXISTS hotels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text NOT NULL,
    description text,
    image_url text,
    rating numeric CHECK (rating >= 0 AND rating <= 5),
    price numeric,
    original_price numeric,
    category text,
    amenities text[],
    features text[],
    availability boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (name, location)
);

-- Notifications table (depends on profiles)
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ========================
-- INDEXES
-- ========================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price);

-- ========================
-- TRIGGERS FOR updated_at
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_trips
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_bookings
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_destinations
BEFORE UPDATE ON destinations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_hotels
BEFORE UPDATE ON hotels
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- ========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Trips
CREATE POLICY "Users can view their own trips" ON trips
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON trips
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON trips
FOR UPDATE USING (auth.uid() = user_id);

-- Bookings
CREATE POLICY "Users can view their own bookings" ON bookings
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM trips t WHERE t.id = bookings.trip_id AND t.user_id = auth.uid()
    )
);

-- Destinations (public read, admin write)
CREATE POLICY "Anyone can view destinations" ON destinations
FOR SELECT USING (true);

CREATE POLICY "Only admin can modify destinations" ON destinations
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Hotels (public read, admin write)
CREATE POLICY "Anyone can view hotels" ON hotels
FOR SELECT USING (true);

CREATE POLICY "Only admin can modify hotels" ON hotels
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

-- ========================
-- SAMPLE DATA
-- ========================
INSERT INTO destinations (name, country, description, image_url, rating, price_range, best_time, highlights, category)
VALUES
('Meghalaya', 'India', 'A lush, hilly state known for its living root bridges, waterfalls, and rolling green landscapes.', '/placeholder1.svg?height=300&width=400', 4.8, '$$$', 'April-June, September-October', ARRAY['Living Root Bridges', 'Cherrapunji', 'Shillong', 'Nohkalikai Falls'], 'Nature'),
('Tokyo', 'Japan', 'A bustling metropolis blending traditional culture with cutting-edge technology.', '/placeholder2.svg?height=300&width=400', 4.7, '$$$$', 'March-May, September-November', ARRAY['Shibuya Crossing', 'Tokyo Tower', 'Senso-ji Temple', 'Tsukiji Fish Market'], 'Urban'),
('Ladakh', 'India', 'A high-altitude desert famous for its monasteries, mountain passes, and stunning Himalayan landscapes.', '/placeholder3.svg?height=300&width=400', 4.6, '$$', 'May-September', ARRAY['Pangong Lake', 'Leh Palace', 'Magnetic Hill', 'Nubra Valley'], 'Adventure'),
('Mizoram', 'India', 'A picturesque state with rolling hills, vibrant tribal culture, and beautiful lakes.', '/placeholder1.svg?height=300&width=400', 4.5, '$$', 'October-March', ARRAY['Aizawl', 'Vantawng Falls', 'Reiek Tlang', 'Palak Dil'], 'Nature'),
('Santorini', 'Greece', 'Stunning Greek island famous for its white-washed buildings, blue-domed churches, and sunsets.', '/placeholder.svg?height=300&width=400', 4.9, '$$$', 'April-October', ARRAY['Oia Village', 'Red Beach', 'Akrotiri', 'Fira Town'], 'Beach'),
('Dubai', 'UAE', 'Modern city known for luxury shopping, ultramodern architecture, and vibrant nightlife.', '/placeholder.svg?height=300&width=400', 4.4, '$$$$', 'November-March', ARRAY['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'], 'Luxury')
ON CONFLICT (name, country) DO NOTHING;

INSERT INTO hotels (name, location, description, image_url, rating, price, original_price, category, amenities, features, availability)
VALUES
('Ri Kynjai – Serenity by the Lake', 'Meghalaya, India', 'Luxury lakeside resort offering stunning views and warm Khasi hospitality.', '/placeholder.svg?height=300&width=400', 4.8, 220.00, 300.00, 'Luxury', ARRAY['Spa', 'Fine Dining', 'Lake View', 'Cultural Activities'], ARRAY['Umiam Lake View', 'Traditional Architecture', 'Nature Trails'], true),
('Park Hyatt Tokyo', 'Tokyo, Japan', 'Sophisticated hotel in Shinjuku with panoramic city views.', '/placeholder.svg?height=300&width=400', 4.7, 650.00, 800.00, 'Luxury', ARRAY['Spa', 'Pool', 'Business Center', 'Fitness Center'], ARRAY['City Views', 'Traditional Japanese Design', 'Premium Location'], true),
('The Grand Dragon Ladakh', 'Ladakh, India', 'Upscale hotel blending Ladakhi tradition with modern comfort, offering breathtaking mountain views.', '/placeholder.svg?height=300&width=400', 4.6, 180.00, 250.00, 'Resort', ARRAY['Heating', 'Restaurant', 'Tour Desk', 'Garden'], ARRAY['Mountain Views', 'Traditional Decor', 'Central Location'], true),
('Hotel Regency', 'Mizoram, India', 'Comfortable hotel in Aizawl offering panoramic city views and modern amenities.', '/placeholder.svg?height=300&width=400', 4.5, 90.00, 130.00, 'Boutique', ARRAY['Restaurant', 'Free Wi-Fi', 'Room Service', 'Parking'], ARRAY['City Views', 'Central Location', 'Budget Friendly'], true),
('Canaves Oia Hotel', 'Santorini, Greece', 'Boutique hotel with infinity pools and caldera views.', '/placeholder.svg?height=300&width=400', 4.9, 580.00, 720.00, 'Boutique', ARRAY['Infinity Pool', 'Spa', 'Fine Dining', 'Concierge'], ARRAY['Caldera View', 'Sunset Views', 'Traditional Architecture'], true),
('Burj Al Arab', 'Dubai, UAE', 'Iconic sail-shaped luxury hotel on its own island.', '/placeholder.svg?height=300&width=400', 4.8, 1200.00, 1500.00, 'Luxury', ARRAY['Private Beach', 'Helicopter Pad', 'Butler Service', 'Multiple Restaurants'], ARRAY['Iconic Architecture', 'All-Suite Accommodation', 'Ultra-Luxury'], true)
ON CONFLICT (name, location) DO NOTHING;
