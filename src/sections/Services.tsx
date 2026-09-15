import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ShoppingBag, Lock, Briefcase, Wallet, PiggyBank, CreditCard, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Service Card
function ServiceCard({ icon: Icon, title, subtitle, color }: { icon: any, title: string, subtitle: string, color: string }) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => toast.info(`Viewing ${title} details`)}
          >
            View Details
          </Button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Bank Service Item
function BankServiceItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="hidden sm:grid grid-cols-3 gap-8 text-sm text-muted-foreground flex-1">
        <span>Lorem Ipsum</span>
        <span>Many publishing</span>
        <span>Many publishing</span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => toast.info(`Viewing ${title} details`)}
      >
        View Details
      </Button>
    </div>
  );
}

export function Services() {
  const featuredServices = [
    { icon: Shield, title: 'Life Insurance', subtitle: 'Unlimited protection', color: 'bg-blue-100 text-blue-600' },
    { icon: ShoppingBag, title: 'Shopping', subtitle: 'Buy. Think. Grow.', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Lock, title: 'Safety', subtitle: 'We are your allies', color: 'bg-green-100 text-green-600' },
  ];

  const bankServices = [
    { icon: Briefcase, title: 'Business loans', description: 'It is a long established' },
    { icon: Wallet, title: 'Checking accounts', description: 'It is a long established' },
    { icon: PiggyBank, title: 'Savings accounts', description: 'It is a long established' },
    { icon: CreditCard, title: 'Debit and credit cards', description: 'It is a long established' },
    { icon: Heart, title: 'Life Insurance', description: 'It is a long established' },
    { icon: Briefcase, title: 'Business loans', description: 'It is a long established' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Services</h2>

      {/* Featured Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      {/* Bank Services List */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Bank Services List</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {bankServices.map((service, index) => (
              <BankServiceItem key={index} {...service} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
