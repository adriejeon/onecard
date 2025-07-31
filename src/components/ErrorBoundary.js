import React from "react";
import { View, Text, StyleSheet } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>앱에서 오류가 발생했습니다</Text>
          <Text style={styles.error}>{this.state.error?.toString()}</Text>
          <Text style={styles.stack}>
            {this.state.errorInfo?.componentStack}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F3FA",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  error: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
  },
  stack: {
    fontSize: 12,
    color: "#666",
  },
});

export default ErrorBoundary;
