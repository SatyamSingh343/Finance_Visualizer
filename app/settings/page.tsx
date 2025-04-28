'use client';

import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { FinanceProvider } from '@/context/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Check, DownloadCloud, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleExportData = () => {
    toast.success('Data exported successfully!');
  };

  const handleImportData = () => {
    toast.success('Data imported successfully!');
  };

  const handleClearData = () => {
    setShowConfirmation(true);
  };

  const confirmClearData = () => {
    toast.success('All data cleared successfully!');
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container px-4 py-6 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between dark and light mode
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    size="sm" 
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                  <Button 
                    size="sm" 
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when you approach budget limits
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import or clear your finance data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex items-center gap-2"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportData}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Danger Zone
                  </p>
                  {showConfirmation ? (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Are you sure? This cannot be undone.</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={confirmClearData}
                      >
                        Yes, clear data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConfirmation(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={handleClearData}
                    >
                      Clear All Data
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <FinanceProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsContent />
      </ThemeProvider>
    </FinanceProvider>
  );
}