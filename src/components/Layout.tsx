
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  ArrowLeft, 
  ArrowRight, 
  Database, 
  FileText, 
  Home, 
  Link as LinkIcon 
} from 'lucide-react';
import PDFExportButton from './PDFExportButton';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Summary Dashboard', icon: Home, href: '/' },
    { name: 'Network Analytics', icon: Database, href: '/network-analytics' },
    { name: 'Inbound Transactions', icon: ArrowRight, href: '/inbound-transactions' },
    { name: 'Outbound Transactions', icon: ArrowLeft, href: '/outbound-transactions' },
    { name: 'Address Attribution', icon: FileText, href: '/address-attribution' },
    { name: 'Fund Source Hierarchy', icon: LinkIcon, href: '/fund-source-hierarchy' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <BarChart className="h-8 w-8 text-crypto-teal" />
            <span className="text-xl font-bold">Crypto Sleuth</span>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-6 py-3 transition-colors ${
                      isActive
                        ? 'bg-crypto-teal bg-opacity-10 text-crypto-teal border-r-4 border-crypto-teal'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h2>
          <PDFExportButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
