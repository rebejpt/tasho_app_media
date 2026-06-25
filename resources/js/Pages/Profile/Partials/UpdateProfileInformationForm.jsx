import { usePage, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className }) {
    // ✅ Récupérer auth depuis usePage
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        country: user?.country || '',
        profession: user?.profession || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informations du profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour vos informations personnelles.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nom" />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full"
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full"
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Téléphone" />
                    <TextInput
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="country" value="Pays" />
                    <TextInput
                        id="country"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.country} />
                </div>

                <div>
                    <InputLabel htmlFor="profession" value="Métier" />
                    <TextInput
                        id="profession"
                        value={data.profession}
                        onChange={(e) => setData('profession', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.profession} />
                </div>

                {mustVerifyEmail && user?.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Votre email n'est pas vérifié.
                            <button
                                type="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cliquez ici pour renvoyer l'email de vérification.
                            </button>
                        </p>
                    </div>
                )}

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        Un nouveau lien de vérification a été envoyé à votre email.
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Enregistré.</p>
                    )}
                </div>
            </form>
        </section>
    );
}