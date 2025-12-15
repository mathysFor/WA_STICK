"use client";

import { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "@/app/firebase/client";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        fetchOrders();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch (err) {
      setError("Erreur de connexion : " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOrders([]);
    } catch (err) {
      setError("Erreur de déconnexion : " + err.message);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError("");

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch("/api/admin/orders", {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la récupération des commandes");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("fr-FR");
  };

  const formatAmount = (amount) => {
    if (amount === undefined) return "N/A";
    return `${amount}€`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour accéder aux commandes
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Commandes</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Commandes ({orders.length})
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Liste de toutes les commandes passées sur le site
            </p>
          </div>

          {ordersLoading ? (
            <div className="px-4 py-8 text-center">
              <div className="text-lg">Chargement des commandes...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Aucune commande trouvée
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            Commande #{order.id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.customer?.name} - {order.customer?.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)} - {formatAmount(order.amount)}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </div>

                      {/* Order details */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Items */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Articles</h4>
                          <ul className="mt-1 text-sm text-gray-600">
                            {order.items?.map((item, index) => (
                              <li key={index}>
                                {item.title || item.model} × {item.quantity}
                              </li>
                            )) || <li>Aucun article</li>}
                          </ul>
                        </div>

                        {/* Shipping */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Livraison</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {order.shipping?.address && (
                              <div>
                                {order.shipping.address}<br />
                                {order.shipping.city} {order.shipping.postalCode}<br />
                                {order.shipping.country}
                              </div>
                            )}
                            {order.customer?.phone && (
                              <div>Tél: {order.customer.phone}</div>
                            )}
                          </div>
                        </div>

                        {/* Invoice */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Facture</h4>
                          <div className="mt-1 text-sm">
                            {order.invoiceUrl ? (
                              <a
                                href={order.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-800"
                              >
                                Voir la facture →
                              </a>
                            ) : (
                              <span className="text-gray-500">Non disponible</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
