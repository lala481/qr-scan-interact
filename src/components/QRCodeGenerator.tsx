
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatEther, parseEther } from 'ethers';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const QRCodeGenerator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: '',
    amount: '',
  });
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    generateEIP681URI();
  }, [formData]);

  const generateEIP681URI = () => {
    try {
      if (!formData.address || !formData.amount) return;
      
      // Create EIP-681 compliant URI
      const uri = `ethereum:${formData.address}@1?value=${parseEther(formData.amount)}`;
      setQrValue(uri);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      toast({
        title: "Copied!",
        description: "QR code data copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md overflow-hidden backdrop-blur-sm bg-white/80 shadow-xl border-0">
        <div className="space-y-8 p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight text-center">Generate QR Code</h2>
            <p className="text-sm text-muted-foreground text-center">
              Create a QR code for Ethereum transactions
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Recipient Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-white/50"
              />
            </div>
          </div>

          {qrValue && (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  className="transition-all duration-300 ease-in-out"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full bg-white/50 hover:bg-white transition-all duration-300"
              >
                Copy QR Data
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
