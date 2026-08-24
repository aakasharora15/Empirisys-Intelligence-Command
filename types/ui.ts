/**
 * UI-Specific Types
 * Navigation, filters, table configuration, breadcrumbs,
 * command palette, toasts, and other UI state types.
 */

import type { LucideIcon } from "lucide-react";
import type { Enums } from "./database";

// ─── Navigation ──────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SidebarConfig {
  groups: NavGroup[];
  footer_items: NavItem[];
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export type BreadcrumbConfig = Record<string, BreadcrumbItem[]>;

// ─── Filters ─────────────────────────────────────────────────────────

export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
  icon?: LucideIcon;
  color?: string;
}

export interface FilterGroup<T = string> {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date-range" | "range" | "search";
  options?: FilterOption<T>[];
  default_value?: T | T[];
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: string | string[];
  display_value: string;
}

export interface CompetitorFilters {
  search: string;
  threat_level: Enums<"threat_level">[];
  status: Enums<"entity_status">[];
  sectors: string[];
}

export interface SignalFilters {
  search: string;
  signal_type: Enums<"signal_type">[];
  severity: Enums<"severity_level">[];
  status: Enums<"signal_status">[];
  source_type: Enums<"signal_source_type">[];
  competitor_id: string | null;
  date_from: string | null;
  date_to: string | null;
  tags: string[];
}

export interface TenderFilters {
  search: string;
  status: Enums<"tender_status">[];
  bid_decision: Enums<"bid_decision">[];
  sectors: string[];
  value_min: number | null;
  value_max: number | null;
  deadline_from: string | null;
  deadline_to: string | null;
  assigned_to: string | null;
  region: string | null;
}

export interface RegulationFilters {
  search: string;
  regulation_type: Enums<"regulation_type">[];
  status: Enums<"regulation_status">[];
  impact_level: Enums<"severity_level">[];
  jurisdiction: string | null;
  sectors_affected: string[];
  assigned_to: string | null;
}

export interface ContentFilters {
  search: string;
  content_type: Enums<"content_type">[];
  status: Enums<"content_status">[];
  category: string | null;
  tags: string[];
  author_id: string | null;
}

export interface DocumentFilters {
  search: string;
  document_type: Enums<"document_type">[];
  processing_status: Enums<"processing_status">[];
  source_entity_type: string | null;
  tags: string[];
}

// ─── Table ───────────────────────────────────────────────────────────

export interface TableColumn<T = unknown> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableState {
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: "asc" | "desc";
  selected_ids: string[];
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
  requireConfirmation?: boolean;
  confirmMessage?: string;
}

// ─── Command Palette ─────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  shortcut?: string;
  group: string;
  href?: string;
  action?: () => void;
  keywords?: string[];
}

export interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

// ─── Toast / Notification ────────────────────────────────────────────

export interface ToastConfig {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ─── Modal / Dialog ──────────────────────────────────────────────────

export interface ModalConfig {
  id: string;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface ConfirmDialogConfig {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

// ─── Form ────────────────────────────────────────────────────────────

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "multi-select" | "number" | "date" | "url" | "email" | "tags";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: FilterOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// ─── Layout ──────────────────────────────────────────────────────────

export interface PageHeaderConfig {
  title: string;
  description?: string;
  actions?: PageAction[];
  breadcrumbs?: BreadcrumbItem[];
}

export interface PageAction {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost" | "destructive";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// ─── Chart ───────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "donut" | "area";
  data: ChartDataPoint[] | TimeSeriesPoint[];
  title?: string;
  x_label?: string;
  y_label?: string;
  show_legend?: boolean;
  height?: number;
}

// ─── Severity / Status Colors ────────────────────────────────────────

export type StatusColor = "default" | "success" | "warning" | "danger" | "info" | "muted";

export interface StatusConfig {
  label: string;
  color: StatusColor;
  icon?: LucideIcon;
}
