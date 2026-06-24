import { useState, useEffect, useCallback, useMemo } from 'react';
import propertyService from '@/services/property.service';
import { SearchMetadata, City, Area, PropertyNameRecord } from '@/types/services';
import { cityCenters } from '@/components/Map/locationData.example';

/**
 * Hook for managing and resolving dynamic location metadata (cities, areas, properties)
 * and providing coordinates for map centering.
 */
export const useLocationMetadata = () => {
    const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                setLoading(true);
                const data = await propertyService.getSearchMetadata();
                setMetadata(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch location metadata:', err);
                setError('Failed to load location data');
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, []);

    /**
     * Resolves coordinates for a given location name (City, Area, or Property)
     */
    const resolveCoordinates = useCallback((locationName: string): { lat: number; lng: number } => {
        if (!locationName) return cityCenters.delhi;

        const normalizedSearch = locationName.trim().toLowerCase();
        const hardcodedKey = normalizedSearch.replace(/\s+/g, '').replace(/-/g, '');

        // 0. Pre-check hardcoded Centers (for robust "cold-start" when metadata is null)
        if (cityCenters[hardcodedKey as keyof typeof cityCenters]) {
            return cityCenters[hardcodedKey as keyof typeof cityCenters];
        }

        if (!metadata) return cityCenters.delhi;

        // 1. Check Property Names (Highest Precision)
        const property = metadata?.propertyNames?.find(
            p => p.name.toLowerCase() === normalizedSearch
        );
        if (property?.coordinates) return property.coordinates;

        // 2. Check Areas
        const area = metadata?.areas?.find(
            a => a.name.toLowerCase() === normalizedSearch
        );
        if (area?.coordinates) return area.coordinates;

        // 3. Check Cities
        const city = metadata?.cities?.find(
            c => c.name.toLowerCase() === normalizedSearch
        );
        if (city?.coordinates) return city.coordinates;

        // 4. Special Hub Handle (Aliases)
        if (normalizedSearch.includes('bengaluru') || normalizedSearch.includes('bangalore')) {
            const bglr = metadata?.cities?.find(c => c.name === 'Bangalore');
            if (bglr?.coordinates) return bglr.coordinates;
        }

        if (normalizedSearch.includes('gurgaon') || normalizedSearch.includes('gurugram')) {
            const grg = metadata?.cities?.find(c => c.name === 'Gurgaon');
            if (grg?.coordinates) return grg.coordinates;
        }

        // 5. Final Fallback to Delhi if still not resolved
        return cityCenters.delhi;
    }, [metadata]);

    return {
        metadata,
        loading,
        error,
        resolveCoordinates
    };
};
