export interface BookmarkListModel {
    data: any;
    index: number;
    onEdit: any;
    onRemove: (e: any) => void;
    onHover: (e: any) => void;
}

export interface BookmarkButtonModel {
    onOpenBookmark: () => void;
}

export interface BookmarkStoreModel {
    bookmarks: any;
}

export interface BookmarkStoreModel {
    bookmarks: any;
}

export interface BookmarkStoreSelectedModel {
    selectedDom: any;
}

