<!-- BEGIN SIDEBAR -->
<div class="page-sidebar-wrapper">
    <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
    <!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
    <div class="page-sidebar navbar-collapse collapse">
        <!-- BEGIN SIDEBAR MENU -->
        <ul class="page-sidebar-menu" data-auto-scroll="true" data-slide-speed="200">
            <!-- DOC: To remove the sidebar toggler from the sidebar you just need to completely remove the below "sidebar-toggler-wrapper" LI element -->
            <li class="sidebar-toggler-wrapper">
                <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
                <div class="sidebar-toggler">
                </div>
                <!-- END SIDEBAR TOGGLER BUTTON -->
            </li>
            <li>
                <a href="{{ route('admin.users.index') }}">
                    <i class="icon-user"></i>
                    <span class="title">Users</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li>
                        <a href="{{ route('admin.users.index') }}">View all</a>
                    </li>
                    <li>
                        <a href="{{ route('admin.users.create') }}">Create user</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{{ route('admin.categories.index') }}">
                    <i class="icon-book-open"></i>
                    <span class="title">Categories</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li>
                        <a href="{{ route('admin.categories.index') }}">View all</a>
                    </li>
                    <li>
                        <a href="{{ route('admin.categories.create') }}">Create category</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{{ route('admin.categories-of-images.index') }}">
                    <i class="icon-book-open"></i>
                    <span class="title">Categories of Images</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li>
                        <a href="{{ route('admin.categories-of-images.index') }}">View all</a>
                    </li>
                    <li>
                        <a href="{{ route('admin.categories-of-images.create') }}">Create category of images</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{{ route('admin.authors.index') }}">
                    <i class="icon-book-open"></i>
                    <span class="title">Authors</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li>
                        <a href="{{ route('admin.authors.index') }}">View all</a>
                    </li>
                    <li>
                        <a href="{{ route('admin.authors.create') }}">Create author</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="{{ route('admin.quotes.index') }}">
                    <i class="icon-book-open"></i>
                    <span class="title">Quotes</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li>
                        <a href="{{ route('admin.quotes.index') }}">View all</a>
                    </li>
                    <li>
                        <a href="{{ route('admin.quotes.create') }}">Create quote</a>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- END SIDEBAR MENU -->
    </div>
</div>
<!-- END SIDEBAR -->