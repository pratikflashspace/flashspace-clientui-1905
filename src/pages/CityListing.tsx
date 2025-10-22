import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CityListing = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || 'your city';
  const location = searchParams.get('location') || '';
  const service = searchParams.get('service') || 'workspaces';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {service.charAt(0).toUpperCase() + service.slice(1)} in {city}
            </h1>
            {location && (
              <p className="text-muted-foreground">
                Near {location}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Search Results Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're working on bringing you the best workspaces in {city}.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/services">
                <Button>Browse Services</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Return Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CityListing;
