defmodule ChatApiWeb.SessionController do
  use ChatApiWeb, :controller

  alias ChatApi.Users
  alias ChatApi.Users.User
  alias ChatApiWeb.APIAuthPlug
  alias Plug.Conn

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, %{"user" => user_params}) do
    conn
    |> Pow.Plug.authenticate_user(user_params)
    |> case do
      {:ok, conn} ->
        json(conn, %{
          data: %{
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token]
          }
        })

      {:error, conn} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid email or password"}})
    end
  end

  @spec renew(Conn.t(), map()) :: Conn.t()
  def renew(conn, _params) do
    config = Pow.Plug.fetch_config(conn)

    conn
    |> APIAuthPlug.renew(config)
    |> case do
      {conn, nil} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      {conn, _user} ->
        json(conn, %{
          data: %{
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token]
          }
        })
    end
  end

  @spec delete(Conn.t(), map()) :: Conn.t()
  def delete(conn, _params) do
    conn
    |> Pow.Plug.delete()
    |> json(%{data: %{}})
  end

  def me(conn, _params) do
    case conn.assigns.current_user do
      %{
        id: id,
        email: email,
        account_id: account_id,
        email_alert_on_new_message: email_alert_on_new_message
      } ->
        json(conn, %{
          data: %{
            id: id,
            email: email,
            account_id: account_id,
            email_alert_on_new_message: email_alert_on_new_message
          }
        })

      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})
    end
  end

  def update(conn, %{"email_alert_on_new_message" => email_alert_on_new_message}) do
    current_user = conn.assigns.current_user
    attrs = %{email_alert_on_new_message: email_alert_on_new_message}

    with {:ok, %User{} = user} <- Users.update_user(current_user, attrs) do
      IO.inspect(user)
      IO.inspect(conn)
      conn = assign(conn, :current_user, user)
      IO.puts("AFTER")
      IO.inspect(conn)

      json(conn, %{
        data: %{
          ok: true
        }
      })
    end
  end
end
