import Breadcrumbs from '@/modules/dashboard/ui/components/breadcrumbs';
import SearchInput from '@/modules/dashboard/ui/components/search-input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumbs />
      </div>
      <div className='flex items-center gap-2 px-4'>
        <div className='flex'>
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
