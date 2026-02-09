------------------------------------Main modules-----------------------------------
Dashboard
Clients
Client Enquiries
Invoices & Payments
Booking Calendar
My Spaces
(Future) Tickets, Feedback, Mail/Visits, Team Members

Every module follows same UI structure----------------------
Sidebar
Topbar/Navbar
Page Header
Cards / Tables / Lists
Filters and Search
Actions (buttons / dropdown)

Dashboard---------------------------------------------------
Layout handles Sidebar + Topbar + Footer
Pages only render page content
Components are reusable
Data layer is separated

Folder Structure--------------------------------------------------
src/
  app/
    routes/
    layouts/

  pages/spacePortal/
    Dashboard/
    Clients/
    ClientEnquiries/
    InvoicesPayments/
    BookingCalendar/
    MySpaces/

  components/
    layout/
      Sidebar/
      Topbar/
      Navbar/
      Footer/
    ui/
      Button/
      Badge/
      Card/
      StatCard/
      Table/
      Tabs/
    features/
      clients/
      enquiries/
      invoices/
      calendar/
      spaces/

  services/
    apiClient.ts
    clients.service.ts
    enquiries.service.ts
    invoices.service.ts
    bookings.service.ts
    spaces.service.ts

  types/
    client.ts
    enquiry.ts
    invoice.ts
    booking.ts
    space.ts

  utils/
    formatDate.ts
    formatCurrency.ts
    constants.ts


Routing---------
/spaceportal/dashboard
/spaceportal/booking-analytics
/spaceportal/booking-calendar
/spaceportal/clients
/spaceportal/client-enquiries
/spaceportal/invoices-payments
/spaceportal/tickets
/spaceportal/space-management


Data Layer Standard--------------
Data flow:
API → service → typed model → UI     -------services/apiClient.ts

TypeScript Model Requirement----------------
Every module must have strict types inside types/.
Required types:
Client
Enquiry
Invoice
Booking
Space
Statuses must be controlled using union types or enums:
"ACTIVE" | "PENDING" | "LOST"
"PAID" | "OVERDUE" | "PENDING"

Pagination + Filtering Standard------------------
All list pages must support:
page
limit
total
Search must be debounced (~300ms).


Error + Loading Handling----------------
Every API-driven page must support:
loading state (skeleton/spinner)
empty state ("No records found")
error state (friendly message, no crash)

UI Design System----------------
Theme must remain consistent across portal:
Primary: #3FA69E
Background: slate-50
Card: white
Border: slate-200
All badge colors and status mappings must be centralized (avoid hardcoding).


Implementation Order (Recommended)--------------------
Layout (Sidebar + Topbar/Navbar + Footer)
Routing setup
Core UI components (Button, Badge, Card, Tabs, Table)
Dashboard
Clients
Client Enquiries
Invoices & Payments
Booking Calendar
My Spaces
Backend integration (replace mock data)

Development Rules (Avoid Errors)--------------------
Use consistent naming (clientId, spaceId, invoiceId)
No duplicated UI code across pages
Keep formatting in utils/ (currency, date, etc.)
Always use import type { ... } for types
Use centralized constants for plan/status labels


