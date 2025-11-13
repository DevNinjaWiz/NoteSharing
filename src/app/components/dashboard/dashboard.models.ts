export type IconName =
  | 'description'
  | 'star'
  | 'history'
  | 'delete'
  | 'book'
  | 'logout'
  | 'expand_more'
  | 'expand_less'
  | 'person'
  | 'person_add';

export type NavKey = 'all' | 'favorites' | 'recents' | 'trash';

export interface NavItem {
  readonly key: NavKey;
  readonly label: string;
  readonly icon: IconName;
  readonly isPrimary?: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortMode = 'date' | 'creator' | 'favorite';
