import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Compass, User, Heart, Map, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Descubrir",
    url: createPageUrl("Discover"),
    icon: Compass,
  },
  {
    title: "Mapa",
    url: createPageUrl("Map"),
    icon: Map,
  },
  {
    title: "Favoritos",
    url: createPageUrl("Favorites"),
    icon: Heart,
  },
  {
    title: "Perfil",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: #6366F1;
          --primary-dark: #4F46E5;
          --secondary: #1E293B;
          --accent: #F59E0B;
          --background: #FEFEFE;
          --surface: #F8FAFC;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-indigo-50">
        <Sidebar className="border-r border-indigo-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-800">Cultura Cerca</h2>
                <p className="text-xs text-slate-500">Descubre tu ciudad</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Navegación
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 rounded-xl py-3 px-4 ${
                          location.pathname === item.url ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Estadísticas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Lugares descubiertos</span>
                    <span className="ml-auto font-bold text-indigo-600">0</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Favoritos guardados</span>
                    <span className="ml-auto font-bold text-purple-600">0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">Usuario</p>
                <p className="text-xs text-slate-500 truncate">Explora tu cultura local</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-sm border-b border-indigo-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-indigo-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-800">Cultura Cerca</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}