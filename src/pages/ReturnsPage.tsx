import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Truck,
  FileText,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const ReturnsPage = () => {
  const returnSteps = [
    {
      step: 1,
      title: "Contact Support",
      description: "Call or email our support team to initiate the return process",
      icon: <Phone className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      step: 2,
      title: "Schedule Pickup",
      description: "We'll schedule a pickup time that works for you",
      icon: <Truck className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      step: 3,
      title: "Equipment Inspection",
      description: "Our team will inspect the equipment upon pickup",
      icon: <Shield className="h-6 w-6" />,
      color: "text-purple-600"
    },
    {
      step: 4,
      title: "Return Confirmation",
      description: "You'll receive confirmation and any applicable refunds",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-orange-600"
    }
  ];

  const returnPolicies = [
    {
      title: "Early Returns",
      description: "Return equipment before the scheduled pickup date",
      details: "Contact us at least 24 hours in advance. Partial refunds may apply based on usage.",
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Damaged Equipment",
      description: "What to do if equipment is damaged",
      details: "Immediately contact our support team. Do not attempt repairs. We'll assess the damage and handle insurance claims.",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600"
    },
    {
      title: "Extension Requests",
      description: "Need to keep equipment longer?",
      details: "Contact us at least 24 hours before scheduled pickup. Additional charges will apply for extended rentals.",
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600"
    }
  ];

  const contactInfo = [
    {
      method: "Phone",
      details: "1-800-RENT-HUB",
      description: "Call us for immediate assistance",
      icon: <Phone className="h-5 w-5" />
    },
    {
      method: "Email",
      details: "returns@renthub.com",
      description: "Send us a detailed message",
      icon: <Mail className="h-5 w-5" />
    },
    {
      method: "Live Chat",
      details: "Available 24/7",
      description: "Chat with our support team",
      icon: <Clock className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ArrowLeft className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Returns & Pickup</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple and hassle-free equipment returns with our professional pickup service
          </p>
        </div>

        {/* Return Process Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Return Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="text-sm">
                      Step {step.step}
                    </Badge>
                  </div>
                  <div className={`mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ${step.color}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Return Policies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Return Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnPolicies.map((policy, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${policy.color}`}>{policy.icon}</div>
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-medium text-sm">{policy.description}</p>
                  <p className="text-muted-foreground text-sm">{policy.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <Card className="mb-12 bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Important Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Before Return</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clean equipment thoroughly</li>
                  <li>• Remove any personal items</li>
                  <li>• Ensure all parts are included</li>
                  <li>• Check for any damage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pickup Requirements</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Equipment must be accessible</li>
                  <li>• Someone must be present</li>
                  <li>• Valid ID required for verification</li>
                  <li>• Payment of any additional fees</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{contact.method}</h3>
                    <p className="text-primary font-medium mb-2">{contact.details}</p>
                    <p className="text-muted-foreground text-sm">{contact.description}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Contact {contact.method}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What if I can't be present for pickup?</h3>
                <p className="text-muted-foreground text-sm">
                  Contact us to arrange an alternative pickup time or designate someone to be present on your behalf.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How long does the pickup process take?</h3>
                <p className="text-muted-foreground text-sm">
                  Typically 15-30 minutes depending on the amount of equipment and inspection requirements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens if equipment is missing or damaged?</h3>
                <p className="text-muted-foreground text-sm">
                  Our team will document any issues and contact you immediately. Additional charges may apply for missing or damaged items.
                </p>
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

export default ReturnsPage;
