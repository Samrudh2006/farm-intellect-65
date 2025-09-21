import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Video, ExternalLink } from "lucide-react";

export const KnowledgeHub = () => {
  const videos = [
    {
      id: 1,
      title: "Wheat Farming Best Practices (गेहूं की खेती)",
      description: "Learn modern techniques for wheat cultivation",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "12:30",
      category: "Crops"
    },
    {
      id: 2,
      title: "Organic Pest Control (जैविक कीट नियंत्रण)",
      description: "Natural methods to control pests without chemicals",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "8:45",
      category: "Pest Control"
    },
    {
      id: 3,
      title: "Drip Irrigation Setup (ड्रिप सिंचाई)",
      description: "How to install and maintain drip irrigation system",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "15:20",
      category: "Irrigation"
    },
    {
      id: 4,
      title: "Soil Testing Methods (मिट्टी परीक्षण)",
      description: "Simple ways to test your soil quality at home",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "10:15",
      category: "Soil Health"
    },
    {
      id: 5,
      title: "Weather Prediction for Farmers (मौसम की भविष्यवाणी)",
      description: "Traditional and modern weather forecasting methods",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "9:30",
      category: "Weather"
    },
    {
      id: 6,
      title: "Government Schemes for Farmers (सरकारी योजनाएं)",
      description: "Latest government schemes and how to apply",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "18:45",
      category: "Schemes"
    }
  ];

  const articles = [
    {
      title: "10 Tips for Better Crop Yield",
      description: "Proven strategies to increase your farm productivity",
      readTime: "5 min read"
    },
    {
      title: "Water Conservation Techniques",
      description: "Save water and reduce irrigation costs",
      readTime: "7 min read"
    },
    {
      title: "Market Price Analysis 2024",
      description: "Understanding market trends for better profits",
      readTime: "10 min read"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Hub (ज्ञान केंद्र)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Learn from expert farmers and agricultural scientists through videos and articles
          </p>
        </CardContent>
      </Card>

      {/* Video Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Video className="h-5 w-5" />
          Educational Videos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <PlayCircle className="h-6 w-6 mr-2" />
                    Watch Now
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                  {video.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 line-clamp-2">{video.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Latest Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">{article.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Links */}
      <Card>
        <CardHeader>
          <CardTitle>Join Farming Communities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.open('https://t.me/farmer_community', '_blank')}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.82-.896 6.728-.896 6.728-.896 6.728-1.292 1.299-1.292 1.299s-.462-.47-1.187-.796c-.725-.326-1.615-.592-1.615-.592s-1.33-.557-1.813-1.002c-.483-.445-.484-.942-.244-1.615.24-.673.72-1.487.72-1.487s2.17-2.085 2.915-2.587c.745-.502 1.38-.44 1.38-.44s.49-.042.633.203c.143.245.123.576-.243.8-.366.224-2.678 1.733-2.678 1.733l-.004.003s-.317.24-.604.04c-.287-.2-1.156-.8-1.156-.8s-.936-.6-1.037-.635c-.101-.035-.257-.123-.165-.52.092-.397.594-1.084.594-1.084s3.417-3.407 4.232-3.926c.815-.519 1.484-.404 1.484-.404s.508-.017.787.18c.279.197.332.5.088.837z"/>
            </svg>
            Join Telegram Group - Punjab Farmers
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.open('https://wa.me/+919876543210', '_blank')}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp Expert Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};