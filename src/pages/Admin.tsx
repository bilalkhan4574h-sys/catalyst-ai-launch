import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { setPageSeo } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Briefcase,
  Users,
  Cpu,
  List,
  Quote,
  Menu,
  Image
} from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminServices } from '@/components/admin/AdminServices';
import { AdminCaseStudies } from '@/components/admin/AdminCaseStudies';
import { AdminTestimonials } from '@/components/admin/AdminTestimonials';
import { AdminProcess } from '@/components/admin/AdminProcess';
import { AdminTechStack } from '@/components/admin/AdminTechStack';
import { AdminBlog } from '@/components/admin/AdminBlog';
import { AdminContact } from '@/components/admin/AdminContact';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminMedia } from '@/components/admin/AdminMedia';

type Section = 'dashboard' | 'services' | 'case-studies' | 'testimonials' | 'process' | 'tech' | 'blog' | 'contact' | 'media' | 'settings';

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    setPageSeo({
      title: 'Admin Dashboard | Catalyst AI',
      description: 'Catalyst AI admin dashboard to manage site content and settings.',
      canonical: `${window.location.origin}/admin`,
      robots: 'noindex,nofollow',
    });
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold">Access denied</h1>
          <p className="text-muted-foreground">
            Your account doesn’t have admin access.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/">Go home</Link>
            </Button>
            <Button variant="glow" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'case-studies', label: 'Case Studies', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'process', label: 'Process', icon: List },
    { id: 'tech', label: 'Tech Stack', icon: Cpu },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'contact', label: 'Contact Submissions', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ] as const;

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'media':
        return <AdminMedia />;
      case 'services':
        return <AdminServices />;
      case 'case-studies':
        return <AdminCaseStudies />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'process':
        return <AdminProcess />;
      case 'tech':
        return <AdminTechStack />;
      case 'blog':
        return <AdminBlog />;
      case 'contact':
        return <AdminContact />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <Link to="/" className="font-display text-xl font-bold text-accent">
          Catalyst AI
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="text-sm text-muted-foreground truncate">
          {user.email}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Link to="/" className="font-display text-lg font-bold text-accent">
          Catalyst AI
        </Link>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
