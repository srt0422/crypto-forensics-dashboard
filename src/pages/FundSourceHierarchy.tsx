import { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fundSourceTree } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

// Utility to collect all node IDs in the tree
function collectAllNodeIds(node) {
  let ids = [node.id];
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      ids = ids.concat(collectAllNodeIds(child));
    }
  }
  return ids;
}

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

interface FundSourceHierarchyProps {
  pdfExportMode?: boolean;
}

const FundSourceHierarchy: React.FC<FundSourceHierarchyProps> = () => {
  // Read global flag for PDF export mode
  const [pdfExportMode, setPdfExportMode] = useState(!!window.__pdfExportMode);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!!window.__pdfExportMode !== pdfExportMode) {
        setPdfExportMode(!!window.__pdfExportMode);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pdfExportMode]);

  const allNodeIds = useRef(collectAllNodeIds(fundSourceTree));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [fundSourceTree.id]: true,
  });
  const prevExpanded = useRef<Record<string, boolean>>();

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expose expand/collapse all for PDF export
  useEffect(() => {
    window.__expandAllFundSourceNodes = () => {
      prevExpanded.current = expanded;
      const all = {};
      for (const id of allNodeIds.current) {
        all[id] = true;
      }
      setExpanded(all);
    };
    window.__restoreFundSourceNodes = () => {
      if (prevExpanded.current) {
        setExpanded(prevExpanded.current);
      }
    };
    return () => {
      delete window.__expandAllFundSourceNodes;
      delete window.__restoreFundSourceNodes;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

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
          <div className={pdfExportMode ? 'pdf-export-mode' : 'overflow-auto max-h-[600px]'}>
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

// For PDF export integration
// window.__expandAllFundSourceNodes() to expand all
// window.__restoreFundSourceNodes() to restore previous state
