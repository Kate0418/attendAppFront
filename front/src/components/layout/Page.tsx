interface Props {
    title: string;
    loaderFlg?: boolean;
    children?: React.ReactNode;
    h: number;
}

export function Page (props: Props) {
    const { title, loaderFlg = false, children, h } = props; // 520
    const in_h = h - 60
    return (
        <div className="py-5">
            <div className="border border-[var(--text-color)] rounded-xl bg-white" style={{ height: `${h}px` }}>
                <div className="bg-[var(--text-color)] text-[var(--base-color)] p-1 rounded-t-lg">{title}</div>
                <div className="px-2 lg:px-8 lg:pt-5 overflow-y-auto" style={{ height: `${in_h}px` }}>
                    { loaderFlg 
                        ? <div className="flex items-center justify-center h-full">
                            <div className="square-spin-2" />
                        </div>
                        : children
                    }
                </div>
            </div>
        </div>
    )
}