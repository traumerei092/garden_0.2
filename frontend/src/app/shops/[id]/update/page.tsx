import React from 'react';
import ShopUpdateForm from '@/components/ShopUpdateForm';

interface ShopUpdatePageProps {
  params: { id: string }
}

const ShopUpdatePage: React.FC<ShopUpdatePageProps> = ({ params }) => {
    const shopId = Number(params.id);

    if (isNaN(shopId)) {
        return <div>Invalid shop ID</div>;
    }

    return <ShopUpdateForm shopId={shopId} />;
};

export default ShopUpdatePage;