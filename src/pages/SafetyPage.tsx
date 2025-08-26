import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Phone,
  ArrowLeft,
  HardHat,
  Eye,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const SafetyPage = () => {
  const safetyCategories = [
    {
      title: "Personal Protective Equipment",
      icon: <HardHat className="h-6 w-6" />,
      color: "text-orange-600",
      items: [
        "Always wear appropriate PPE for the equipment being used",
        "Safety glasses, gloves, and steel-toed boots when required",
        "Hard hats for construction equipment",
        "Hearing protection for loud machinery"
      ]
    },
    {
      title: "Equipment Inspection",
      icon: <Eye className="h-6 w-6" />,
      color: "text-blue-600",
      items: [
        "Inspect equipment before each use",
        "Check for visible damage or wear",
        "Ensure all safety guards are in place",
        "Verify all controls and emergency stops work"
      ]
    },
    {
      title: "Electrical Safety",
      icon: <Zap className="h-6 w-6" />,
      color: "text-yellow-600",
      items: [
        "Keep electrical equipment away from water",
        "Use proper extension cords rated for the equipment",
        "Never overload electrical circuits",
        "Inspect cords for damage before use"
      ]
    }
  ];

  const doDontItems = {
    do: [
      "Read and follow all equipment manuals",
      "Keep work areas clean and organized",
      "Use equipment only for its intended purpose",
      "Maintain proper ventilation in enclosed spaces",
      "Have a first aid kit readily available",
      "Keep emergency contact numbers handy"
    ],
    dont: [
      "Never operate equipment under the influence",
      "Don't remove or bypass safety guards",
      "Avoid using damaged or malfunctioning equipment",
      "Never leave equipment running unattended",
      "Don't exceed equipment weight or capacity limits",
      "Avoid working alone with dangerous equipment"
    ]
  };

  const emergencyProcedures = [
    {
      title: "Equipment Malfunction",
      description: "Stop using equipment immediately and contact support",
      action: "Call: 1-800-RENT-HUB",
      color: "text-red-600"
    },
    {
      title: "Injury or Accident",
      description: "Seek medical attention first, then contact us",
      action: "Emergency: 911",
      color: "text-red-600"
    },
    {
      title: "Equipment Damage",
      description: "Document the damage and contact support immediately",
      action: "Email: safety@renthub.com",
      color: "text-orange-600"
    }
  ];

  const safetyResources = [
    {
      title: "Equipment Manuals",
      description: "Download PDF manuals for all equipment",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Safety Videos",
      description: "Watch instructional safety videos",
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: "Safety Training",
      description: "Schedule professional safety training",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Safety Guidelines</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your safety is our top priority. Follow these guidelines to ensure safe equipment operation.
          </p>
        </div>

        {/* Safety Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Safety Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${category.color}`}>{category.icon}</div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Do's and Don'ts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Do's */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span>Do's</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doDontItems.do.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Don'ts */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <span>Don'ts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doDontItems.dont.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Procedures */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Emergency Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyProcedures.map((procedure, index) => (
              <Card key={index} className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{procedure.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-red-800">{procedure.description}</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">{procedure.action}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Safety Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                    <Button variant="outline" className="w-full">
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Important Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-800">
                These safety guidelines are general recommendations. Always refer to the specific equipment manual 
                for detailed safety instructions. If you have any questions about equipment safety, contact our 
                support team immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Safety Team
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Safety Manual
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
