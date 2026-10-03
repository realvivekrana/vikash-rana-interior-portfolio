import { getServiceIcon } from '../../utils/icons';

const ServiceCard = ({ service }) => {
  const Icon = getServiceIcon(service.icon);
  return (
    <div className="bg-surface border border-line p-6 sm:p-8 h-full hover:border-gold/60 transition-colors">
      <Icon className="text-gold text-3xl mb-5 sm:mb-6" />
      <h3 className="font-serif text-xl text-white mb-3">{service.title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{service.description}</p>
    </div>
  );
};

export default ServiceCard;