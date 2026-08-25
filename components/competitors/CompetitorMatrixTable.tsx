'use client';
import Image from 'next/image';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  ExpandedState,
} from '@tanstack/react-table';
import { Competitor, CompetitorContent } from '@/lib/db';
import {
  SFCheckmark as Check,
  SFInfoCircle as Info,
  SFXmark as X,
  SFChevronRight as ChevronRight,
  SFChevronDown as ChevronDown,
  SFArrowDownDocument as Download,
  SFCheckmarkCircle as CheckCircle2,
  SFExclamationmarkTriangle as AlertTriangle,
} from 'sf-symbols-lib/monochrome';
import { cn } from '@/lib/utils';
import PdfExportButton from '@/components/ui/PdfExportButton';
import { DeepScanButton } from '@/components/ui/DeepScanButton';

import { DetailDrawer } from './DetailDrawer';
export default function CompetitorMatrixTable({
  data,
  contentList,
}: {
  data: Competitor[];
  contentList: CompetitorContent[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = useMemo<ColumnDef<Competitor>[]>(
    () => [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="cursor-pointer bg-card hover:bg-background rounded transition-all flex items-center justify-center w-5 h-5"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4 text-accent" />
              ) : (
                <ChevronRight className="h-4 w-4 text-text-secondary" />
              )}
            </button>
          );
        },
        size: 40,
      },
      {
        accessorKey: 'name',
        header: 'Competitor',
        size: 200,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-card-border shrink-0 bg-accent/10 flex items-center justify-center relative bg-white">
              <Image
                fill
                sizes="32px"
                src={
                  info.row.original.logoUrl ||
                  `https://www.google.com/s2/favicons?domain=${info.row.original.website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}&sz=128`
                }
                alt={info.getValue() as string}
                className="w-full h-full object-contain absolute inset-0 m-auto z-10 p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="w-full h-full flex items-center justify-center text-accent font-bold absolute inset-0 z-0 bg-accent/10 text-[10px]">
                {(info.getValue() as string).slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-text-primary text-base">
                {info.getValue() as string}
              </span>
              <a
                href={info.row.original.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors mt-0.5"
              >
                {info.row.original.website.replace('https://www.', '').replace('https://', '')}
              </a>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: (info) => {
          const status = info.getValue() as string;
          if (status === 'EMERGING') {
            return (
              <span className="px-2 py-0.5 rounded text-sm font-bold uppercase bg-accent/10 text-accent">
                Emerging
              </span>
            );
          }
          if (status === 'WATCHLIST') {
            return (
              <span className="px-2 py-0.5 rounded text-sm font-bold uppercase bg-accent/10 text-accent">
                Watchlist
              </span>
            );
          }
          return (
            <span className="px-2 py-0.5 rounded text-sm font-bold uppercase bg-text-secondary/10 text-text-secondary">
              Tracked
            </span>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 100,
        cell: (info) => {
          const type = info.getValue() as string;
          return (
            <span
              className={cn(
                'px-2 py-0.5 rounded text-sm font-bold uppercase',
                type === 'Direct' ? 'bg-accent/10 text-accent' : 'bg-accent/10 text-accent',
              )}
            >
              {type}
            </span>
          );
        },
      },
      {
        id: 'capabilities',
        header: 'Capabilities',
        size: 150,
        cell: (info) => {
          const ai = info.row.original.ai_analytics;
          const hse = info.row.original.hse_focus;
          const uk = info.row.original.uk_presence;
          const saas = info.row.original.saas_model;

          const renderIcon = (val: string, label: string) => {
            let icon = <X className="h-3.5 w-3.5 text-[#EF4444]" />;
            if (val === 'yes') icon = <Check className="h-3.5 w-3.5 text-accent" />;
            if (val === 'partial') icon = <Info className="h-3.5 w-3.5 text-accent" />;
            return (
              <div className="flex flex-col items-center gap-0.5" title={label}>
                <span className="text-sm text-text-secondary uppercase">{label.split(' ')[0]}</span>
                {icon}
              </div>
            );
          };

          return (
            <div className="flex gap-2">
              {renderIcon(ai, 'AI')}
              {renderIcon(hse, 'HSE')}
              {renderIcon(uk, 'UK')}
              {renderIcon(saas, 'SaaS')}
            </div>
          );
        },
      },
      {
        accessorKey: 'funding',
        header: 'Funding',
        size: 130,
        cell: (info) => {
          const val = info.getValue() as string;
          let color = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
          if (val.includes('Public')) color = 'bg-accent/10 text-accent border-[var(--accent)]/20';
          if (val.includes('PE Backed'))
            color = 'bg-accent/10 text-accent border-[var(--accent)]/20';
          if (val.includes('VC Backed')) color = 'bg-accent/10 text-accent border-accent/20';
          if (val.includes('Subsidiary'))
            color = 'bg-accent/10 text-accent border-[var(--accent)]/20';

          const label = val.split('(')[0].trim();

          return (
            <span className={cn('px-2 py-0.5 border rounded text-xs font-bold uppercase', color)}>
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: 'client_overlap',
        header: 'Client Overlap',
        size: 100,
        cell: (info) => {
          const val = info.getValue() as string;
          if (val === 'High')
            return (
              <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] rounded text-sm font-bold uppercase">
                High
              </span>
            );
          if (val === 'Medium')
            return (
              <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-sm font-bold uppercase">
                Medium
              </span>
            );
          return (
            <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-sm font-bold uppercase">
              Low
            </span>
          );
        },
      },
      {
        accessorKey: 'threat_score',
        header: 'Threat Score',
        size: 110,
        cell: (info) => {
          const score = info.getValue() as number;
          let color = 'bg-accent/10 text-accent';
          if (score >= 80) color = 'bg-[#EF4444]/10 text-[#EF4444]';
          else if (score >= 60) color = 'bg-accent/10 text-accent';

          return (
            <span className={cn('px-2 py-0.5 rounded text-sm font-black tracking-wide', color)}>
              {score}
            </span>
          );
        },
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const downloadCSV = () => {
    const headers = [
      'Competitor',
      'Status',
      'Type',
      'AI Analytics',
      'HSE Focus',
      'UK Presence',
      'SaaS Model',
      'Funding',
      'Client Overlap',
      'Content Activity',
      'Pricing Model',
      'Market Focus',
      'Recent Move',
      'Threat Score',
    ];
    const csvRows = data.map((row) => [
      row.name,
      row.status,
      row.type,
      row.ai_analytics,
      row.hse_focus,
      row.uk_presence,
      row.saas_model,
      row.funding,
      row.client_overlap,
      row.content_activity,
      row.pricing_model,
      (row.market_focus || []).join('; '),
      row.recent_move,
      row.threat_score,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'competitor-intelligence-matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="competitor-matrix-table" className="space-y-4 relative w-full">
      {/* Table Filters & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-background border border-card-border rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Status
            </span>
            <select
              className="bg-card border border-card-border rounded p-1 text-xs text-text-primary focus:outline-none focus:border-accent"
              onChange={(e) =>
                table
                  .getColumn('status')
                  ?.setFilterValue(e.target.value === 'All' ? '' : e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="TRACKED">Tracked Only</option>
              <option value="EMERGING">Emerging</option>
              <option value="WATCHLIST">Watchlist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Type
            </span>
            <select
              className="bg-card border border-card-border rounded p-1 text-xs text-text-primary focus:outline-none focus:border-accent"
              onChange={(e) =>
                table
                  .getColumn('type')
                  ?.setFilterValue(e.target.value === 'All' ? '' : e.target.value)
              }
            >
              <option value="All">All Types</option>
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Client Overlap
            </span>
            <select
              className="bg-card border border-card-border rounded p-1 text-xs text-text-primary focus:outline-none focus:border-accent"
              onChange={(e) =>
                table
                  .getColumn('client_overlap')
                  ?.setFilterValue(e.target.value === 'All' ? '' : e.target.value)
              }
            >
              <option value="All">All Overlaps</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <DeepScanButton label="Hard Scan Market" />
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-card-border hover:bg-card text-text-primary rounded text-sm font-bold transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <PdfExportButton targetId="competitor-matrix-container" filename="competitor-matrix" />
        </div>
      </div>

      {/* Capabilities Legend */}
      <div className="flex items-center gap-6 mb-4 px-2 bg-card/20 py-3 rounded-lg border border-card-border shadow-sm">
        <span className="text-micro font-black text-text-secondary uppercase tracking-wider">
          Capabilities Key:
        </span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
          <span className="text-xs text-text-primary font-medium">
            Native Feature / Strong Presence
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
          <span className="text-xs text-text-primary font-medium">Partial / Acquired</span>
        </div>
        <div className="flex items-center gap-1.5">
          <X className="h-4 w-4 text-[#EF4444]" />
          <span className="text-xs text-text-primary font-medium">Missing / No Presence</span>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div
        id="competitor-matrix-container"
        className="rounded-xl border border-card-border bg-card/20 backdrop-blur-xl overflow-x-auto relative shadow-2xl"
      >
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-card/40 backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={cn(
                      'p-3 text-sm font-bold text-text-secondary uppercase tracking-wider border-b border-card-border cursor-pointer select-none whitespace-nowrap',
                      idx === 0 && 'w-10 px-1',
                      idx === 1 && 'sticky left-0 z-10 bg-transparent backdrop-blur-xl',
                    )}
                    style={{ width: header.column.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <span className="text-accent">↑</span>,
                        desc: <span className="text-accent">↓</span>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={cn(
                    'border-b border-card-border backdrop-blur-md',
                    'hover:bg-card/30 transition-colors',
                    row.getIsExpanded() ? 'bg-card/40 border-b-transparent shadow-md' : '',
                    (row.original.status === 'EMERGING' || row.original.status === 'WATCHLIST') &&
                      'bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]',
                  )}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    const isStickyBg =
                      row.original.status === 'EMERGING' || row.original.status === 'WATCHLIST'
                        ? 'bg-accent/10 backdrop-blur-xl'
                        : 'bg-transparent backdrop-blur-xl';
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'p-4 align-middle',
                          idx === 0 && 'w-10 px-2 text-center',
                          idx === 1 && `sticky left-0 z-10 ${isStickyBg}`,
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="p-0 border-b border-card-border bg-background"
                    >
                      <DetailDrawer
                        comp={row.original}
                        contentList={contentList.filter((c) => c.competitor_id === row.original.id)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
