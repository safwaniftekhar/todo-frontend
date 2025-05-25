import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">TaskCollab</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Collaborate on Tasks Seamlessly
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create, manage, and collaborate on tasks with your team. Stay organized and boost productivity with
                    our intuitive ToDo application.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] lg:h-[500px] bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg">
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-64">
                      <h3 className="font-semibold mb-2">Work Tasks</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-sm bg-primary"></div>
                          </div>
                          <span>Update documentation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary"></div>
                          <span>Prepare presentation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary"></div>
                          <span>Review pull requests</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-64">
                      <h3 className="font-semibold mb-2">Project Alpha</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-sm bg-primary"></div>
                          </div>
                          <span>Design wireframes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-sm bg-primary"></div>
                          </div>
                          <span>Implement API</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded border border-primary"></div>
                          <span>User testing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to manage tasks and collaborate with your team
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-muted-foreground">
                  Create multiple ToDo lists and organize your tasks efficiently
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Collaboration</h3>
                <p className="text-center text-muted-foreground">
                  Invite team members and assign different permission levels
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Real-time Updates</h3>
                <p className="text-center text-muted-foreground">
                  See changes instantly with real-time synchronization
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 TaskCollab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
