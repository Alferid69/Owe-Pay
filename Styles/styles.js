import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: 12, // Ensures a good height for touch interaction
    paddingHorizontal: 20, // Adds width to the button
    borderRadius: 8, // Rounded corners for a modern feel
    alignItems: "center", // Center text inside the button
    justifyContent: "center",
    marginVertical: 10, // Spacing between buttons and other elements
  },
  registerButton: {
    backgroundColor: "#0086B3", // Matching the register container theme
    borderColor: "#005F80",
    borderWidth: 1,
  },

  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "#f4f7fb",
    paddingBottom: 59,
  },
  availableItemsContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#0086B3",
  },
  soldItemsContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#804200",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  summary: {
    padding: 16,
    marginVertical: 24,
    borderRadius: 8,
    backgroundColor: "#f9fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    backgroundColor: "#0086B3",
    alignItems: "center",
  },

  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exportButton: {
    backgroundColor: "#4CAF50", // Green background for export buttons
  },
  deptors: {
    display: "flex",
    flexDirection: "row",
    height: 88,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Ensure buttons are evenly spaced
    columnGap: 18,
    margin: 10,
    backgroundColor: "#f9f9f9", // Light background to separate the section
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pdfButton: {
    backgroundColor: "#FF9800", // Orange background for PDF export
  },
  resetButton: {
    backgroundColor: "#f44336", // Red background for reset button
    borderColor: "#d32f2f",
    borderWidth: 1,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A", // A sleek gray color
    backgroundColor: "#F0F0F5", // Soft background to make it stand out
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 10,
    elevation: 2, // Adds a subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  containerBase: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  registerContainer: {
    backgroundColor: "#E6F7FF", // Soft blue for register section
    borderColor: "#0086B3", // Darker blue border for emphasis
    borderWidth: 3,
    borderRadius: 10,
    padding: 8,
  },

  header: {
    marginTop: 33,
    borderWidth: 1,
    alignItems: "center",
    padding: 15, // Padding around the header
    borderRadius: 10, // Rounded corners
    position: "relative",
  },
  lang: {
    position: "absolute",
    right: 5,
    top: 13,
  },

  title: {
    fontSize: 22, // Larger font size for the title
    fontWeight: "bold", // Bold text
    color: "#000", // White color for the text
  },
});
