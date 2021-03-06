defmodule ChatApi.WidgetSettings.WidgetSetting do
  use Ecto.Schema
  import Ecto.Changeset

  alias ChatApi.Accounts.Account

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "widget_settings" do
    field :title, :string
    field :subtitle, :string
    field :color, :string
    field :greeting, :string
    field :new_message_placeholder, :string
    field :base_url, :string
    belongs_to(:account, Account)

    timestamps()
  end

  @doc false
  def changeset(widget_settings, attrs) do
    widget_settings
    |> cast(attrs, [
      :title,
      :subtitle,
      :color,
      :greeting,
      :new_message_placeholder,
      :base_url,
      :account_id
    ])
    |> validate_required([:title, :subtitle, :color, :account_id])
    |> unique_constraint(:account_id)
  end
end
