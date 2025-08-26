import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  FileText,
  Shield,
  Truck,
  CreditCard
} from "lucide-react";

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I rent equipment?",
      answer: "Browse our equipment catalog, select the items you need, choose your rental dates, and complete the checkout process. We'll deliver the equipment to your location and pick it up when you're done."
    },
    {
      question: "What is the minimum rental period?",
      answer: "Most equipment has a minimum rental period of 1 day. Some specialized equipment may require longer minimum periods. Check the product details for specific requirements."
    },
    {
      question: "Do you offer delivery and pickup?",
      answer: "Yes! We offer free delivery and pickup within 25 miles for rentals over ₹200. Additional delivery fees apply for locations outside this range."
    },
    {
      question: "What if the equipment breaks during my rental?",
      answer: "All our equipment is fully insured and maintained. If something breaks due to normal wear and tear, we'll replace it immediately at no additional cost."
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes, you can extend your rental by contacting our support team at least 24 hours before your scheduled pickup date. Additional charges will apply."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods including UPI, Google Pay, and PhonePe."
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "text-blue-600"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Call us directly",
      action: "1-800-RENT-HUB",
      color: "text-green-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us an email",
      action: "support@renthub.com",
      color: "text-purple-600"
    }
  ];

  const quickLinks = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Rental Agreement",
      description: "Read our rental terms and conditions"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Insurance Coverage",
      description: "Learn about our equipment insurance"
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Delivery Information",
      description: "Delivery zones and scheduling"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payment & Billing",
      description: "Payment methods and billing FAQ"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Help Center</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or contact support..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ${option.color}`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                  <Button variant="outline" className="w-full">
                    {option.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{link.icon}</div>
                    <div>
                      <h3 className="font-semibold text-sm">{link.title}</h3>
                      <p className="text-muted-foreground text-xs">{link.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Support Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p className="text-muted-foreground">Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Emergency Support</h3>
                <p className="text-muted-foreground">24/7 emergency support available</p>
                <p className="text-muted-foreground">Call: 1-800-RENT-HUB</p>
                <p className="text-muted-foreground">Email: emergency@renthub.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
