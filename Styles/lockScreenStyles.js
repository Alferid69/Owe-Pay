// LockScreen.js
import { StyleSheet } from "react-native";

export const lockScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8f9fa",
    marginBottom: 20,
  },
  pinInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  pinInput: {
    width: "100%",
    height: 60,
    borderWidth: 2,
    borderColor: "#1db954",
    borderRadius: 12,
    fontSize: 26,
    textAlign: "center",
    marginHorizontal: 10,
    color: "#1db954",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1db954",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 40,
    shadowColor: "#1db954",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#ff1744",
    fontSize: 16,
    marginTop: 15,
  },
  unlockMethods: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
