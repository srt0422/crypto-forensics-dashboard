
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fundSourceTree } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface FundSourceNodeProps {
  node: typeof fundSourceTree;
  expanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  indent?: number;
}

const FundSourceNode: React.FC<FundSourceNodeProps> = ({ 
  node, 
  expanded, 
  toggleExpand, 
  indent = 0 
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id] || false;
  
  return (
    <>
      <div 
        className={`
          flex items-center py-2 px-4 hover:bg-gray-50 border-b
          ${indent > 0 ? 'border-l-4' : ''}
          ${indent === 1 ? 'border-l-crypto-blue' : ''}
          ${indent === 2 ? 'border-l-crypto-teal' : ''}
          ${indent === 3 ? 'border-l-crypto-yellow' : ''}
          ${indent === 4 ? 'border-l-crypto-purple' : ''}
        `}
        style={{ paddingLeft: `${indent * 20 + 16}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => toggleExpand(node.id)}
            className="mr-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
        {!hasChildren && <span className="mr-2 w-6"></span>}
        
        <div className="flex-1 flex items-center">
          <span className="font-mono text-xs text-gray-600">{node.address}</span>
          <Badge variant="outline" className="ml-2">{node.chain}</Badge>
        </div>
        <div className="font-bold text-right">${node.value.toFixed(2)}</div>
      </div>
      
      {hasChildren && isExpanded && (
        <>
          {node.children!.map((child) => (
            <FundSourceNode
              key={child.id}
              node={child}
              expanded={expanded}
              toggleExpand={toggleExpand}
              indent={indent + 1}
            />
          ))}
        </>
      )}
    </>
  );
};

const FundSourceHierarchy = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [fundSourceTree.id]: true,
  });

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <DashboardHeader 
        title="Fund Source Hierarchy" 
        subtitle="Interactive visualization of fund flow sources (up to 5 hops)" 
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Fund Flow Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[600px]">
            <div className="min-w-full">
              <div className="bg-gray-100 py-2 px-4 flex font-semibold border-b">
                <div className="flex-1">Address</div>
                <div>Value</div>
              </div>
              <FundSourceNode 
                node={fundSourceTree} 
                expanded={expanded} 
                toggleExpand={toggleExpand} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundSourceHierarchy;
