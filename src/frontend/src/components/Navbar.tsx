import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Flower,
  Heart,
  LogOut,
  Menu,
  Shield,
  ShoppingCart,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useFavourites } from "../hooks/useFavourites";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { count: favCount } = useFavourites();
  const { count: cartCount } = useCart();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Decorative top border */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(var(--festival-pink)), oklch(var(--marigold)), oklch(var(--gold)), oklch(var(--marigold)), oklch(var(--festival-pink)))",
        }}
      />
      <div
        className="backdrop-blur-md border-b border-border/60"
        style={{ background: "oklch(var(--background) / 0.94)" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-gold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                  }}
                >
                  <Flower className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg text-gradient-gold">
                  Flower Decor
                </span>
                <span className="text-[10px] font-body font-medium tracking-[0.15em] uppercase text-muted-foreground -mt-0.5">
                  Events
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-all duration-200 ${
                  isActive("/")
                    ? "text-primary-foreground shadow-festival"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
                style={
                  isActive("/")
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                      }
                    : {}
                }
              >
                Home
              </Link>
            </nav>

            {/* Favourites + Cart icons */}
            <div className="hidden md:flex items-center gap-1 mr-1">
              {/* Favourites */}
              <Link
                to="/favourites"
                className="relative p-2 rounded-full hover:bg-muted transition-colors group"
                aria-label="Favourites"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${pathname === "/favourites" ? "fill-red-500 text-red-500" : "text-foreground/70 group-hover:text-foreground"}`}
                />
                {favCount > 0 && (
                  <motion.span
                    key={favCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-body font-bold text-white flex items-center justify-center px-1"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    {favCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors group"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-body font-bold text-white flex items-center justify-center px-1"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Auth + Admin buttons */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 hover:border-primary/60 font-body"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                size="sm"
                className="gap-2 font-body font-semibold text-primary-foreground"
                style={{
                  background: isAuthenticated
                    ? "oklch(var(--muted))"
                    : "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                  color: isAuthenticated ? "oklch(var(--foreground))" : "white",
                }}
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                ) : isLoggingIn ? (
                  "Logging in…"
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            {/* Mobile: favourites + cart icons */}
            <div className="md:hidden flex items-center gap-1 mr-1">
              <Link
                to="/favourites"
                className="relative p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Favourites"
              >
                <Heart
                  className={`w-5 h-5 ${pathname === "/favourites" ? "fill-red-500 text-red-500" : "text-foreground/70"}`}
                />
                {favCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    {favCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-foreground/70" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border/60 backdrop-blur-md"
            style={{ background: "oklch(var(--background) / 0.97)" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium font-body transition-all ${
                  isActive("/")
                    ? "text-white"
                    : "text-foreground hover:bg-muted"
                }`}
                style={
                  isActive("/")
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                      }
                    : {}
                }
              >
                Home
              </Link>
              <Link
                to="/favourites"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium font-body text-foreground hover:bg-muted transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favourites
                </span>
                {favCount > 0 && (
                  <span
                    className="text-xs font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    }}
                  >
                    {favCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium font-body text-foreground hover:bg-muted transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  handleAuth();
                }}
                disabled={isLoggingIn}
                className="mt-2 w-full font-body font-semibold"
                style={{
                  background: isAuthenticated
                    ? "oklch(var(--muted))"
                    : "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                  color: isAuthenticated ? "oklch(var(--foreground))" : "white",
                }}
              >
                {isAuthenticated
                  ? "Logout"
                  : isLoggingIn
                    ? "Logging in…"
                    : "Login"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
