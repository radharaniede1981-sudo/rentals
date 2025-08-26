import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Truck, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  User,
  MapPin,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PickupItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  subTotal: number;
}

interface PickupData {
  id: string;
  customer: string;
  invoiceAddress: string;
  deliveryAddress: string;
  sourceLocation: string;
  scheduleDate: string;
  responsible: string;
  transferType: string;
  status: 'draft' | 'ready' | 'done';
  items: PickupItem[];
}

const PickupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pickupData, setPickupData] = useState<PickupData>({
    id: id || `PICKUP-${Date.now()}`,
    customer: '',
    invoiceAddress: '',
    deliveryAddress: '',
    sourceLocation: '',
    scheduleDate: '',
    responsible: '',
    transferType: 'delivery',
    status: 'draft',
    items: []
  });

  const [isLoading, setIsLoading] = useState(false);

  // Mock product data - in real app, this would come from inventory module
  const mockProducts = [
    { id: '1', name: 'Professional Excavator', price: 2500, stock: 5 },
    { id: '2', name: '4K Projector', price: 800, stock: 12 },
    { id: '3', name: 'Wedding Event Package', price: 1500, stock: 3 },
    { id: '4', name: 'Guitar & Amplifier Set', price: 450, stock: 8 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Ready</Badge>;
      case 'done':
        return <Badge variant="default" className="bg-green-100 text-green-800">Done</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const calculateTotals = () => {
    const untaxedTotal = pickupData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalTax = pickupData.items.reduce((sum, item) => sum + item.tax, 0);
    const total = untaxedTotal + totalTax;
    return { untaxedTotal, totalTax, total };
  };

  const addItem = () => {
    const newItem: PickupItem = {
      id: Date.now().toString(),
      product: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      subTotal: 0
    };
    setPickupData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (itemId: string, field: keyof PickupItem, value: any) => {
    setPickupData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Auto-calculate tax and subtotal
          if (field === 'quantity' || field === 'unitPrice') {
            const quantity = field === 'quantity' ? value : item.quantity;
            const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
            const subTotal = quantity * unitPrice;
            const tax = subTotal * 0.18; // 18% GST
            updatedItem.subTotal = subTotal;
            updatedItem.tax = tax;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeItem = (itemId: string) => {
    setPickupData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleCreate = () => {
    if (!pickupData.customer || !pickupData.scheduleDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer and schedule date.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Pickup Created",
      description: "Pickup order has been created successfully.",
    });
  };

  const handleTransfer = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPickupData(prev => ({ ...prev, status: 'ready' }));
      setIsLoading(false);
      toast({
        title: "Transfer Initiated",
        description: "Pickup transfer has been initiated.",
      });
    }, 1000);
  };

  const handleCheckAvailability = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Availability Checked",
        description: "All items are available for pickup.",
      });
    }, 1000);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPickupData(prev => ({ ...prev, status: 'done' }));
      setIsLoading(false);
      toast({
        title: "Pickup Confirmed",
        description: "Pickup has been confirmed and inventory updated.",
      });
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const { untaxedTotal, totalTax, total } = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">PICKUP/OUT/{pickupData.id}</h1>
            <p className="text-muted-foreground">Manage pickup and transfer operations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(pickupData.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={pickupData.customer}
                    onChange={(e) => setPickupData(prev => ({ ...prev, customer: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="responsible">Responsible</Label>
                  <Input
                    id="responsible"
                    value={pickupData.responsible}
                    onChange={(e) => setPickupData(prev => ({ ...prev, responsible: e.target.value }))}
                    placeholder="Enter responsible person"
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleDate">Schedule Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={pickupData.scheduleDate}
                    onChange={(e) => setPickupData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="transferType">Transfer Type</Label>
                  <Select value={pickupData.transferType} onValueChange={(value) => setPickupData(prev => ({ ...prev, transferType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="invoiceAddress">Invoice Address</Label>
                  <Input
                    id="invoiceAddress"
                    value={pickupData.invoiceAddress}
                    onChange={(e) => setPickupData(prev => ({ ...prev, invoiceAddress: e.target.value }))}
                    placeholder="Enter invoice address"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input
                    id="deliveryAddress"
                    value={pickupData.deliveryAddress}
                    onChange={(e) => setPickupData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter delivery address"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceLocation">Source Location</Label>
                  <Input
                    id="sourceLocation"
                    value={pickupData.sourceLocation}
                    onChange={(e) => setPickupData(prev => ({ ...prev, sourceLocation: e.target.value }))}
                    placeholder="Enter source location"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Items</span>
                <Button onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Sub Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickupData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select value={item.product} onValueChange={(value) => {
                          const product = mockProducts.find(p => p.id === value);
                          updateItem(item.id, 'product', value);
                          if (product) {
                            updateItem(item.id, 'unitPrice', product.price);
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (Stock: {product.stock})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>₹{item.tax.toFixed(2)}</TableCell>
                      <TableCell>₹{item.subTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-6 space-y-2">
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Untaxed Total:</span>
                  <span>₹{untaxedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleCreate} 
                className="w-full"
                disabled={isLoading}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button 
                onClick={handleTransfer} 
                variant="outline"
                className="w-full"
                disabled={isLoading || pickupData.status === 'draft'}
              >
                <Truck className="h-4 w-4 mr-2" />
                Transfer
              </Button>
              <Button 
                onClick={handleCheckAvailability} 
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Availability
              </Button>
              <Button 
                onClick={handleConfirm} 
                variant="default"
                className="w-full"
                disabled={isLoading || pickupData.status === 'done'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${pickupData.status === 'draft' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${pickupData.status === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <FileText className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Draft</span>
                </div>
                <div className={`flex items-center gap-3 ${pickupData.status === 'ready' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${pickupData.status === 'ready' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <Clock className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Ready</span>
                </div>
                <div className={`flex items-center gap-3 ${pickupData.status === 'done' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${pickupData.status === 'done' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PickupPage;
