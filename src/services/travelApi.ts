// API service for fetching cities and travel data

interface CountryData {
    name: {
        common: string
        official: string
    }
    capital?: string[]
    name_obj?: { common: string } // Added to explain mapping
    region: string
    subregion?: string
    population: number
    flags: {
        png: string
        svg: string
    }
    cca3: string
    continents: string[]
}

export interface City {
    id: string
    name: string
    country: string
    region: string
    costIndex: number
    popularity: number
    description: string
    image: string
    population: number
}

// Fetch cities from REST Countries API
export const fetchCities = async (): Promise<City[]> => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca3')
        if (!response.ok) throw new Error('Failed to fetch countries')

        const countries: CountryData[] = await response.json()

        // Filter countries with capitals and map to our City format
        const apiCities = countries
            .filter(country => country.capital && country.capital.length > 0)
            .map(country => {
                const cityName = country.capital ? country.capital[0] : 'Unknown City'
                const costIndex = getCostIndexByRegion(country.region)
                const popularity = Math.min(95, Math.floor((country.population / 10000000) * 20) + 60)

                return {
                    id: country.cca3,
                    name: cityName,
                    country: country.name.common,
                    region: country.region,
                    costIndex,
                    popularity,
                    description: `Experience the culture and history of ${cityName}, the capital of ${country.name.common}.`,
                    image: `https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800&q=80`, // Generic travel image
                    population: country.population
                }
            })

        // Add some famous non-capital cities for better discovery
        const nonCapitals: City[] = [
            { id: 'NYC', name: 'New York City', country: 'United States', region: 'Americas', costIndex: 95, popularity: 98, description: 'The city that never sleeps, a global hub of culture and finance.', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80', population: 8400000 },
            { id: 'SYD', name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 85, popularity: 94, description: 'Famous for its opera house, harbor, and beautiful beaches.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80', population: 5312000 },
            { id: 'BCN', name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 75, popularity: 96, description: 'A city of Gaudí masterpieces, beaches, and vibrant street life.', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80', population: 1620000 },
            { id: 'MUM', name: 'Mumbai', country: 'India', region: 'Asia', costIndex: 50, popularity: 92, description: 'The bustling heart of India, home to Bollywood and colonial history.', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80', population: 18410000 },
            { id: 'RIO', name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', costIndex: 60, popularity: 93, description: 'Known for Christ the Redeemer, Carnival, and stunning coastlines.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80', population: 6748000 }
        ]

        const allCities = [...nonCapitals, ...apiCities]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 60)

        return allCities
    } catch (error) {
        console.error('Error fetching cities:', error)
        // Return fallback data if API fails
        return getFallbackCities()
    }
}

// Helper function to estimate cost index by region
const getCostIndexByRegion = (region: string): number => {
    const costMap: { [key: string]: number } = {
        'Europe': 75,
        'Americas': 70,
        'Asia': 55,
        'Oceania': 80,
        'Africa': 45,
        'Antarctic': 95
    }
    return costMap[region] || 60
}

// Search for any city using Open-Meteo Geocoding API - Robust, Free, and CORS-compliant
export const searchCities = async (query: string): Promise<City[]> => {
    if (!query || query.length < 2) return fetchCities()

    try {
        console.log(`🔍 [travelApi] Searching Open-Meteo for: ${query}...`)
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
        )

        if (!response.ok) throw new Error('Search failed')

        const data = await response.json()

        if (!data.results) return []

        // Map Open-Meteo results to our City format
        const cities: City[] = data.results.map((item: any) => {
            const cityName = item.name
            const countryName = item.country || 'Unknown'
            const regionName = item.admin1 || item.timezone || 'Unknown'

            return {
                id: item.id.toString(),
                name: cityName,
                country: countryName,
                region: regionName,
                costIndex: 65,
                popularity: 80,
                description: `${cityName} is a beautiful location in ${countryName}. Discover its unique charm and culture.`,
                image: `https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800&q=80`,
                population: item.population || 0
            }
        })

        return cities
    } catch (error) {
        console.error('❌ [travelApi] Error searching cities:', error)
        return fetchCities()
    }
}

// Fallback cities if API fails
const getFallbackCities = (): City[] => {
    return [
        {
            id: 'FRA',
            name: 'Paris',
            country: 'France',
            region: 'Europe',
            costIndex: 85,
            popularity: 95,
            description: 'The City of Light, known for art, fashion, and gastronomy.',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
            population: 2161000
        },
        {
            id: 'JPN',
            name: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            costIndex: 90,
            popularity: 92,
            description: 'A bustling metropolis blending traditional temples with neon skyscrapers.',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
            population: 13960000
        },
        {
            id: 'NYC',
            name: 'New York City',
            country: 'United States',
            region: 'Americas',
            costIndex: 95,
            popularity: 98,
            description: 'The global center of finance, culture, and entertainment.',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
            population: 8336000
        }
    ]
}

// Enhanced activities data (can be replaced with real API later)
export interface Activity {
    id: string
    name: string
    city: string
    category: string
    duration: string
    cost: number
    description: string
    image: string
    rating: number
}

// Search for activities/landmarks using Wikipedia API - Stable, Free, and CORS-compliant
export const searchActivities = async (query: string): Promise<Activity[]> => {
    if (!query || query.length < 2) return getActivities()

    try {
        console.log(`🔍 [travelApi] Searching Wiki for: ${query}...`)
        // Using Wikipedia search with origin=* for CORS
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=15`
        )

        if (!response.ok) throw new Error('Wiki search failed')

        const data = await response.json()
        const searchResults = data.query.search

        // Map Wiki results to Activity format
        const activities: Activity[] = searchResults.map((item: any, idx: number) => {
            const name = item.title

            // Randomize some fields for travel app feel
            const categories = ['Sightseeing', 'Culture', 'History', 'Landmark', 'Museum', 'Park']
            const costs = [0, 15, 25, 35, 50, 75, 120]
            const durations = ['1-2 hours', '2-3 hours', '3-4 hours', 'Half day', 'Full day']

            // Extract a cleaner city/context if possible, otherwise generic
            const snippet = item.snippet.replace(/<span class="searchmatch">|<\/span>/g, '').slice(0, 100) + '...'

            return {
                id: `wiki-${item.pageid}`,
                name: name,
                city: 'Famous Location', // Wikipedia search doesn't easily give the city in the search result
                category: categories[idx % categories.length],
                duration: durations[idx % durations.length],
                cost: costs[idx % costs.length],
                description: snippet || `Explore the historic and cultural significance of ${name}.`,
                image: `https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&q=80&w=800&q=80`,
                rating: 4.2 + (Math.random() * 0.8)
            }
        })

        return activities
    } catch (error) {
        console.error('❌ [travelApi] Error searching activities:', error)
        return getActivities()
    }
}

export const getActivities = (): Activity[] => {
    return [
        {
            id: '1',
            name: 'Eiffel Tower Skip-the-Line Tour',
            city: 'Paris',
            category: 'Sightseeing',
            duration: '2-3 hours',
            cost: 45,
            description: 'Skip the queues and enjoy panoramic views from the iconic Eiffel Tower',
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
            rating: 4.8
        },
        {
            id: '2',
            name: 'Seine River Dinner Cruise',
            city: 'Paris',
            category: 'Romance',
            duration: '2 hours',
            cost: 85,
            description: 'Romantic evening cruise with 3-course dinner and live music',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
            rating: 4.7
        },
        {
            id: '3',
            name: 'Tokyo Street Food Tour',
            city: 'Tokyo',
            category: 'Food',
            duration: '3 hours',
            cost: 75,
            description: 'Taste authentic Japanese street food in hidden local spots',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
            rating: 4.9
        },
        {
            id: '4',
            name: 'Mount Fuji Day Trip',
            city: 'Tokyo',
            category: 'Adventure',
            duration: 'Full day',
            cost: 120,
            description: 'Guided tour to Mount Fuji with lake cruise and traditional lunch',
            image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80',
            rating: 4.8
        },
        {
            id: '5',
            name: 'Broadway Show Premium Seats',
            city: 'New York',
            category: 'Entertainment',
            duration: '2.5 hours',
            cost: 150,
            description: 'Best seats for top-rated Broadway musicals',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
            rating: 4.9
        },
        {
            id: '6',
            name: 'Central Park Bike Tour',
            city: 'New York',
            category: 'Adventure',
            duration: '2 hours',
            cost: 45,
            description: 'Explore Central Park iconic spots on a guided bike tour',
            image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80',
            rating: 4.6
        },
        {
            id: '7',
            name: 'Sagrada Familia Guided Tour',
            city: 'Barcelona',
            category: 'Culture',
            duration: '1.5 hours',
            cost: 35,
            description: 'Expert-led tour of Gaudí masterpiece with skip-the-line access',
            image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80',
            rating: 4.8
        },
        {
            id: '8',
            name: 'Tapas & Wine Tasting',
            city: 'Barcelona',
            category: 'Food',
            duration: '3 hours',
            cost: 65,
            description: 'Authentic tapas tour with local wine pairings',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80',
            rating: 4.7
        },
        {
            id: '9',
            name: 'Desert Safari Adventure',
            city: 'Dubai',
            category: 'Adventure',
            duration: '6 hours',
            cost: 95,
            description: 'Dune bashing, camel ride, BBQ dinner, and cultural show',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80',
            rating: 4.8
        },
        {
            id: '10',
            name: 'Burj Khalifa At The Top',
            city: 'Dubai',
            category: 'Sightseeing',
            duration: '1.5 hours',
            cost: 55,
            description: 'Visit the world tallest building observation deck',
            image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80',
            rating: 4.9
        },
        {
            id: '11',
            name: 'Colosseum & Roman Forum',
            city: 'Rome',
            category: 'Culture',
            duration: '3 hours',
            cost: 60,
            description: 'Ancient Rome tour with expert archaeologist guide',
            image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80',
            rating: 4.8
        },
        {
            id: '12',
            name: 'Pasta Making Class',
            city: 'Rome',
            category: 'Food',
            duration: '3 hours',
            cost: 70,
            description: 'Learn to make authentic Italian pasta from a local chef',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80',
            rating: 4.9
        },
        {
            id: '13',
            name: 'Thames River Cruise',
            city: 'London',
            category: 'Sightseeing',
            duration: '1 hour',
            cost: 25,
            description: 'See London landmarks from the river with audio guide',
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80',
            rating: 4.5
        },
        {
            id: '14',
            name: 'British Museum Tour',
            city: 'London',
            category: 'Culture',
            duration: '2.5 hours',
            cost: 40,
            description: 'Highlights tour of world-famous artifacts and exhibitions',
            image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80',
            rating: 4.7
        },
        {
            id: '15',
            name: 'Sydney Opera House Tour',
            city: 'Sydney',
            category: 'Culture',
            duration: '1 hour',
            cost: 35,
            description: 'Behind-the-scenes tour of the iconic opera house',
            image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80',
            rating: 4.6
        }
    ]
}
