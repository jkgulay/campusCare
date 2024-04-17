// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { createClient } from "@supabase/supabase-js";

import { setRouter } from "./router/router";

setRouter();



const supabase = createClient(
  "https://fprynlwueelbysitqaii.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcnlubHd1ZWVsYnlzaXRxYWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA5MTQ0NjksImV4cCI6MjAyNjQ5MDQ2OX0.Ttxz2gl9Emtf1gnTlXNArzdrWoClKzhC5KgL83Oz1pU"
);

export { supabase };
